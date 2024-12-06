import express from 'express'
import { Contact } from './contactModel.js'
import { Auth } from '../Authentication/authModel.js'
import {Profile} from '../Profile/profileModel.js'
import {Chat} from '../Chats/chatModel.js'

const ContactRouter = express.Router()

// ContactRouter.post('/add/', async (request, response) => {
//   const { authId,contact_name, contact_number} = request.body;
//   console.log(request.body,"Contact")

//   // try {
//   //   // Check if a contact with the same name or number already exists for the user
//   //   const existingContact = await Contact.findOne({
//   //     authId,
//   //     $or: [
//   //       { contact_name: contact_name },
//   //       { contact_number: contact_number },
//   //     ],
//   //   });

//   //   if (existingContact) {
//   //     if (existingContact.contact_name === contact_name) {
//   //       return response.status(400).json({ message: `Contact name '${contact_name}' already exists.` });
//   //     }
//   //     if (existingContact.contact_number === contact_number) {
//   //       return response.status(400).json({ message: `Contact number '${contact_number}' is already saved with another name.` });
//   //     }
//   //   }

//   //   // If no duplicates, create a new contact
//   //   const newContact = new Contact({
//   //     authId,
//   //     profileId,
//   //     contact_name,
//   //     contact_number,
//   //     status
//   //   });

//   //   const savedContact = await newContact.save();
//   //   response.status(201).json(savedContact);

//   // } catch (error) {
//   //   console.error('Error saving contact:', error);
//   //   response.status(500).json({ message: 'Failed to create contact.', error });
//   // }

//   try {
//     // Step 1: Find the profileId based on the contact_number
//     const contactProfile = await Profile.findOne({ contact_numbercontact_number });
//     console.log(contactProfile,"Contact's Profile")

//     if (!contactProfile) {
//       return response.status(404).json({ message: "Contact not found with this phone number" });
//     }

//     // Step 2: Ensure profileId is not the same as the logged-in user's profileId (authId)
//     // if (contactProfile._id.equals(authId)) {
//     //   return response.status(400).json({ message: "You cannot add your own profile as a contact." });
//     // }

//     // Step 3: Save the contact with the correct profileId and authId
//     const newContact = new Contact({
//       authId,
//       profileId: contactProfile._id,  // Use the profileId of the contact
//       contact_name,
//       contact_number,
//       status: 'pending', // Default status is 'pending' if not provided
//     });

//     // Step 4: Save the new contact
//     const savedContact = await newContact.save();
//     response.status(201).json(savedContact);
//   } catch (error) {
//     // Handle any errors (including duplicate entries, etc.)
//     if (error.code === 11000) {
//       response.status(400).json({ message: "This contact number is already saved for this user." });
//     } else {
//       console.error("Error saving contact:", error);
//       response.status(500).json({ message: "Failed to create contact.", error });
//     }
//     }
//   });

ContactRouter.post('/add/', async (request, response) => {
  const { authId, contact_name, contact_number } = request.body;

  try {
    console.log("Request Body:", request.body);

    // Normalize the contact number to avoid mismatches
    const normalizedNumber = contact_number.replace(/\D/g, ''); // Remove non-numeric characters
    console.log("Normalized contact_number:", normalizedNumber);

    // Step 1: Find the profileId based on the normalized contact_number
    const contactProfile = await Profile.findOne({ phone: normalizedNumber });
    console.log("Contact's Profile:", contactProfile);

  //   if (!contactProfile) {
  //     return response.status(404).json({ message: "Contact not found with this phone number" });
  //   }

  //   // Step 2: Save the contact with the correct profileId and authId
  //   const newContact = new Contact({
  //     authId,
  //     profileId: contactProfile._id, // Use the profileId of the contact
  //     contact_name,
  //     contact_number: normalizedNumber,
  //     isRegistered: contactProfile.isRegistered,
  //     status: 'pending', // Default status is 'pending' if not provided
  //   });
  //   console.log(newContact,"newContact")

  //   // Step 3: Save the new contact
  //   const savedContact = await newContact.save();
  //   response.status(201).json(savedContact);
  // } catch (error) {
  //   // Handle errors (including duplicates, etc.)
  //   if (error.code === 11000) {
  //     response.status(400).json({ message: "This contact number is already saved for this user." });
  //   } else {
  //     console.error("Error saving contact:", error);
  //     response.status(500).json({ message: "Failed to create contact.", error });
  //   }
  // }

// Step 2: If contact has a profile
if (contactProfile) {
  // Save the contact with profile details
  const newContact = new Contact({
    authId,
    profileId: contactProfile._id, // Use the profileId of the contact
    contact_name,
    contact_number: normalizedNumber,
    isRegistered: contactProfile.isRegistered,
    status: 'pending', // Default status is 'pending' if not provided
  });
  console.log(newContact, "newContact with profile");

  // Step 3: Save the new contact with profile data
  const savedContact = await newContact.save();
  return response.status(201).json(savedContact);
} else {
  // Step 4: If no profile is found, save contact without profileId and isRegistered
  const newContactWithoutProfile = new Contact({
    authId,
    contact_name,
    contact_number: normalizedNumber,
    status: 'pending', // Default status is 'pending'
  });
  console.log(newContactWithoutProfile, "newContact without profile");

  // Step 5: Save the new contact without profile data
  const savedContactWithoutProfile = await newContactWithoutProfile.save();
  return response.status(201).json(savedContactWithoutProfile);
}
} catch (error) {
// Handle errors (including duplicates, etc.)
if (error.code === 11000) {
  response.status(400).json({ message: "This contact number is already saved for this user." });
} else {
  console.error("Error saving contact:", error);
  response.status(500).json({ message: "Failed to create contact.", error });
}
}

});


ContactRouter.get('/all/', async (request, response) => {
  const { authId } = request.query; // Retrieve userId from query parameter

  try {
    const contacts = await Contact.find({ authId }); // Filter contacts by userId
    response.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    response.status(500).json({ message: 'Failed to fetch contacts.', error });
  }
});

// Endpoint to get contacts with registration status
ContactRouter.get('/contacts/:authId', async (req, res) => {
  try {
    const authId = req.params.authId;
   

    // Find all contacts for the given userId
    const contacts = await Contact.find({ authId: authId });

    // Fetch registration status for each contact from Auth model
    const contactsWithRegistrationStatus = await Promise.all(contacts.map(async (contact) => {
      const profile = await Profile.findOne({ _id: contact.profileId });
      
      return {
        ...contact.toObject(),  // Spread the contact data
        isRegistered: profile ? profile.isRegistered : false,  // Add registration status
        profilePicture: profile ? profile.profilePicture : null,
        lastSeen: profile ? profile.lastSeen : null,
        online: profile ? profile.online : false,
        // _id:profile ? profile._id : null
      };
    })); 

    res.json(contactsWithRegistrationStatus);
  } catch (error) {
    console.error("Error fetching contacts with registration status", error);
    res.status(500).json({ message: "Error fetching contacts." });
  }
});


// ContactRouter.patch('/update/:id/', async (request, response) => {

//   const { id } = request.params
//   const updatedContact = await Contact.findByIdAndUpdate(id, request.body, { new: true });

//   if (!updatedContact) {
//     return response.status(404).json({ message: 'Contact not found.' });
//   }

//   response.json(updatedContact);
// })

ContactRouter.patch('/update/:id/', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate input here if necessary

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // Ensures validators are run
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.json(updatedContact, { message: "Contact Updates Successfully" });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact.', error });
  }
});


// ContactRouter.delete('/delete/:id/', async (request, response) => {

//   const { id } = request.params
//   const deletedContact = await Contact.findByIdAndDelete(id);

//   if (!deletedContact) {
//     return response.status(404).json({ message: 'Contact not found.' });
//   }

//   response.json({ message: 'Contact deleted successfully' });

// })

ContactRouter.delete('/delete/:id/', async (req, res) => {
  const { id } = req.params;

  try {
    // Validate ID format if necessary
    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact.', error });
  }
});



// Accept contact (use the same ID as contact ID)
ContactRouter.patch('/accept/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      id,  // Find by contact ID
      { status: 'accepted' },  // Update the status
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact accepted', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept contact', error });
  }
});

// Block contact (use the same ID as contact ID)
ContactRouter.patch('/block/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure valid ID and permissions if necessary

    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { status: 'blocked' }, // Update status to blocked
      { new: true, runValidators: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    res.json({ message: 'Contact blocked successfully.', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to block contact.', error });
  }
});


export default ContactRouter





