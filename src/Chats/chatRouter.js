import express from 'express';
import { Chat } from './chatModel.js';  // assuming chatModel.js is in the same directory
import { Message } from './messageModel.js';  // assuming messageModel.js is in the same directory

const ChatRouter = express.Router();

// Create a new chat (when a user starts chatting with another user)
ChatRouter.post('/newchat', async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    const existingChat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.status(400).json({ message: 'Chat already exists' });
    }

    const chat = new Chat({
      participants: [senderId, receiverId],  // participants is an array of both users
    });

    await chat.save();
    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all chats for a specific user (based on their `authId`)
ChatRouter.get('/allchat/:authId', async (req, res) => {
  const { authId } = req.params;

  try {
    // Find all chats that the user is part of (either as sender or receiver)
    const chats = await Chat.find({
      participants: authId,
    }).populate('participants', 'name profilePicture');  // Populate participant details like name and profile picture

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send a message in a chat
// ChatRouter.post('/send', async (req, res) => {
//   const { chatId, senderId, content } = req.body;

//   try {
//     const message = new Message({
//       chatId,
//       sender: senderId,  // Sender's profileId
//       content,
//     });

//     await message.save();

//     // Update the chat's last message and updated time
//     await Chat.findByIdAndUpdate(chatId, {
//       lastMessage: content,
//       updatedAt: Date.now(),
//     });

//     res.status(201).json(message);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Get messages for a chat
// ChatRouter.get('/getmsg/:chatId', async (req, res) => {
//   const { chatId } = req.params;

//   try {
//     const messages = await Message.find({ chatId })
//       .populate('sender', 'name profilePicture')  // Populate sender details (like name and profile picture)
//       .sort({ timestamp: 1 });  // Sort by timestamp in ascending order (oldest messages first)

//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

export default ChatRouter;
