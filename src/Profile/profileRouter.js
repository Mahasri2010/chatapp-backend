import express from "express";
import { Profile } from "./profileModel.js";
import { Chat } from '../Chats/chatModel.js'

const ProfileRouter = express.Router();

// Add a new profile
// ProfileRouter.post('/add', async (req, res) => {
//     const { name, profilePicture = "", about, phone, authId } = req.body;

//     if (!name || !phone || !authId) {
//         return res.status(400).json({ message: "Name, Phone, and User ID are required." });
//     }

//     try {
//         // Check if profile already exists for the given authId
//         const existingProfile = await Profile.findOne({ authId });

//         // if (existingProfile) {
//         //     return res.status(409).json({ message: "Profile already exists for this user." });
//         // }

//         if (existingProfile) {
//             // If profile exists, update it
//             existingProfile.name = name;
//             existingProfile.profilePicture = profilePicture;
//             existingProfile.about = about;
//             existingProfile.phone = phone;

//             await existingProfile.save();  // Save the updated profile

//             return res.status(200).json({ message: "Profile updated successfully.", profile: existingProfile });
//         }

//         // If no existing profile, create a new one
//         const newProfile = new Profile({ name, profilePicture, about, phone, authId, isRegistered: true });
//         await newProfile.save();

//         // Send back the profileId (_id) as part of the response
//         res.status(201).json({
//             message: "Profile created successfully.",
//             profile: { profileId: newProfile._id, name, phone, authId }
//         });
//     } catch (error) {
//         if (error.code === 11000) {
//             return res.status(409).json({ message: "Profile already exists for this user." });
//         }
//         console.error("Error creating profile:", error);
//         res.status(500).json({ message: "Failed to create profile." });
//     }

// });

ProfileRouter.post('/add', async (req, res) => {
    const { name, profilePicture = "", about, phone, authId } = req.body;

    if (!name || !phone || !authId) {
        return res.status(400).json({ message: "Name, Phone, and User ID are required." });
    }

    try {
        // Attempt to create a new profile
        const newProfile = new Profile({ name, profilePicture, about, phone, authId, isRegistered: true });
        
        // Save the new profile to the database
        await newProfile.save();

        // If successfully saved, return success response
        res.status(201).json({ message: "Profile created successfully.", profile: newProfile });

    } catch (error) {
        if (error.code === 11000) {  // Duplicate key error code (MongoDB)
            // Profile already exists, so we should update it
            try {
                // Find the existing profile and update it
                const existingProfile = await Profile.findOne({ authId });

                if (!existingProfile) {
                    return res.status(404).json({ message: "Profile not found." });
                }

                // Update the profile fields
                existingProfile.name = name;
                existingProfile.profilePicture = profilePicture;
                existingProfile.about = about;
                existingProfile.phone = phone;

                await existingProfile.save();  // Save the updated profile

                return res.status(200).json({ message: "Profile updated successfully.", profile: existingProfile });
            } catch (updateError) {
                console.error("Error updating profile:", updateError);
                return res.status(500).json({ message: "Failed to update profile." });
            }
        }

        console.error("Error creating profile:", error);
        return res.status(500).json({ message: "Failed to create profile." });
    }
});



// Get all profiles
ProfileRouter.get('/all', async (req, res) => {

    const { authId } = req.query; // Assuming the userId is passed as a query param

    if (!authId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const allProfiles = await Profile.find({});
        if (allProfiles.length === 0) {
            return res.status(404).json({ message: "No profiles found." });
        }
        res.json(allProfiles);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ message: "Failed to fetch profiles." });
    }
});

// Get a profile by ID

ProfileRouter.get('/get/:authId', async (req, res) => {
    const { authId } = req.params;
    console.log("Received authId:", authId);
    const { includeChatHistory } = req.query; // Optional query parameter to include chat history


    try {
        const profileData = await Profile.findOne({ authId: authId }); // Use authId field
        if (!profileData) {
            return res.status(404).json({ message: "Profile not found." });
        }

        // Prepare response data
        const responseData = {
            profile: {
                authId: profileData.authId,
                name: profileData.name,
                profilePicture: profileData.profilePicture,
                about: profileData.about,
                phone: profileData.phone,
                isRegistered: profileData.isRegistered, // Include registration status
                lastSeen: profileData.lastSeen,
                online: profileData.online,
            },
        }

        // Optionally include chat history if requested
        if (includeChatHistory === "true") {
            const chatHistory = await Chat.find({ participants: authId }); // Assuming Chat collection exists
            responseData.chatHistory = chatHistory || []; // Add chat history if found
        }

        res.json(responseData);

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Failed to fetch profile." });
    }
});


// Update a profile by ID
ProfileRouter.patch('/update/:authId', async (req, res) => {
    const { authId } = req.params;
    const { name, profilePicture, about, phone, } = req.body; // Assuming the user ID is passed in the body of the update request


    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { authId: authId },  // Find the profile by authId
            { name, profilePicture, about, phone },
            { new: true }  // Return the updated document
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        res.json(updatedProfile);
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Failed to update profile." });
    }
});

// Update status and last seen by ID
ProfileRouter.patch('/status/:id', async (req, res) => {
    const { id } = req.params;
    const { online } = req.body; // Only passing 'online' status from request

    console.log('Received PATCH request for ID:', req.params.id);
    console.log('Request body:', req.body);

    try {
        const updateData = {
            online: online || false,
            lastSeen: !online ? Date.now() : null
        };
        console.log('Update data:', updateData);

        const updatedProfile = await Profile.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true } // Return the updated document
        );
        console.log('Updated profile:', updatedProfile);

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found." });
        }

        res.json({ message: "Status updated.", profile: updatedProfile });
    } catch (error) {

        console.log("catch error")
        console.error("Error updating status:", error);
        res.status(500).json({ message: "Failed to update status." });
    }
});

// ProfileRouter.patch('/status/:id', async (req, res) => {
//     const { id } = req.params;
//     const { online } = req.body;

//     try {
//         const updatedProfile = await Profile.findByIdAndUpdate(
//             id,
//             { online: online || false, lastSeen: lastSeen || Date.now() },
//             { new: true }
//         );

//         if (!updatedProfile) {
//             return res.status(404).json({ message: "Profile not found." });
//         }

//         res.json({ message: "Status updated.", profile: updatedProfile });
//     } catch (error) {
//         console.error("Error updating status:", error);
//         res.status(500).json({ message: "Failed to update status." });
//     }
// });

export default ProfileRouter;