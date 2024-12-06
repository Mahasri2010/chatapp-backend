import express from 'express';
import { Chat } from './chatModel.js';  // assuming chatModel.js is in the same directory
import { Message } from './messageModel.js';  // assuming messageModel.js is in the same directory

const ChatRouter = express.Router();

// Create a new chat (when a user starts chatting with another user)
ChatRouter.post('/newchat', async (req, res) => {
  const { senderId, receiverId } = req.body;
  console.log(req.body,"New Chat")
 

  if (!senderId || !receiverId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const existingChat = await Chat.findOne({
      participants: {$size: 2, $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.status(400).json({ message: 'Chat already exists' });
    }

    const chat = new Chat({
      participants: [senderId, receiverId],  // participants is an array of both users
    });
    console.log('Chat participants:', chat.participants);
    console.log('New chat created with ID:', chat);


    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Endpoint to fetch a specific chat between two users
ChatRouter.get('/specific/:authId/:receiverProfileId', async (req, res) => {
  try {
    const { authId, receiverProfileId} = req.params;

    const chat = await Chat.findOne({
      participants: { $all: [authId, receiverProfileId] },
    })
    .populate('participants', 'name profilePicture')
    .populate('lastMessage','content senderId createdAt');

    if (chat) {
      res.status(200).json({
        chatId: chat._id,
        participants: chat.participants,
        lastMessage: chat.lastMessage, // Include lastMessage details
      });
    } else {
      res.status(404).json({ message: 'Chat not found' });
    }
  } catch (error) {
    console.error('Error fetching specific chat:', error);
    res.status(500).json({ message: 'Failed to fetch chat' });
  }
});


// Get all chats for a specific user (based on their `authId`)
ChatRouter.get('/allchat/:authId', async (req, res) => {
  const { authId } = req.params;
  const limit = parseInt(req.query.limit) || 20; // Optional: Pagination limit
  const skip = parseInt(req.query.skip) || 0;    // Optional: Pagination offset
  console.log(req.body, "AllChat")

  try {
    // Find all chats that the user is part of (either as sender or receiver)
    const chats = await Chat.find({
      participants: authId,
    })
    .populate({path:'participants', select: 'name profilePicture'})  // Populate participant details like name and profile picture
    .populate({path:'lastMessage'}) // Fetch details of the last message
    .sort({ updatedAt: -1 }) // Sort by most recently updated
    .limit(limit) // Pagination
    .skip(skip);

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default ChatRouter;
