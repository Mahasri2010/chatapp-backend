import express from 'express'
import { Contact } from './contactModel.js'
import {Auth} from '../Authentication/authModel.js'

const ContactRouter = express.Router()

ContactRouter.post('/add/', async (request, response) => {
  const { authId,profileId,contact_name, contact_number, status } = request.body;

  try {
    // Check if a contact with the same name or number already exists for the user
    const existingContact = await Contact.findOne({
      authId,
      $or: [
        { contact_name: contact_name },
        { contact_number: contact_number },
      ],
    });

    if (existingContact) {
      if (existingContact.contact_name === contact_name) {
        return response.status(400).json({ message: `Contact name '${contact_name}' already exists.` });
      }
      if (existingContact.contact_number === contact_number) {
        return response.status(400).json({ message: `Contact number '${contact_number}' is already saved with another name.` });
      }
    }

    // If no duplicates, create a new contact
    const newContact = new Contact({
      authId,
      profileId,
      contact_name,
      contact_number,
      status
    });

    const savedContact = await newContact.save();
    response.status(201).json(savedContact);

  } catch (error) {
    console.error('Error saving contact:', error);
    response.status(500).json({ message: 'Failed to create contact.', error });
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
      const auth = await Auth.findOne({ _id: contact.contactId });
      return {
        ...contact.toObject(),  // Spread the contact data
        isRegistered: auth ? auth.isRegistered : false,  // Add registration status
      };
    }));

    res.json(contactsWithRegistrationStatus);
  } catch (error) {
    console.error("Error fetching contacts with registration status", error);
    res.status(500).json({ message: "Error fetching contacts." });
  }
});


ContactRouter.patch('/update/:id/', async (request, response) => {

  const { id } = request.params
  const updatedContact = await Contact.findByIdAndUpdate(id, request.body, { new: true });

  if (!updatedContact) {
    return response.status(404).json({ message: 'Contact not found.' });
  }

  response.json(updatedContact);
})

ContactRouter.delete('/delete/:id/', async (request, response) => {

  const { id } = request.params
  const deletedContact = await Contact.findByIdAndDelete(id);

  if (!deletedContact) {
    return response.status(404).json({ message: 'Contact not found.' });
  }

  response.json({ message: 'Contact deleted successfully' });

})

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
    const updatedContact = await Contact.findByIdAndUpdate(
      id,  // Find by contact ID
      { status: 'blocked' },  // Update the status
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact blocked', contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to block contact', error });
  }
});






export default ContactRouter





