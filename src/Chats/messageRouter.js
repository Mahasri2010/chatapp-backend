import express from 'express';
import { Message } from './messageModel.js';  // Assuming the Message model is in the same directory
import { Chat } from './chatModel.js';  // Assuming the Chat model is in the same directory

const MessageRouter = express.Router();

// Send a message in a chat
MessageRouter.post('/send', async (req, res) => {
  const { chatId, senderId, receiverId, content } = req.body;

  if (!chatId || !senderId || !receiverId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  console.log('Received Data:', req.body);
  console.log("chatId:", chatId);
  console.log("senderId:", senderId);
  console.log("receiverId:",receiverId);
  console.log("content:", content);


  try {
    // Create a new message
    const message = new Message({
      chatId,
      senderId,  // Sender's profileId
      receiverId, // Receiver's profileId
      content,
    });

    // Save the message
    await message.save();

    // Update the chat's last message and updated time
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { lastMessage: message._id },
      { new: true }
    );
    console.log('Chat updated:', updatedChat);

    // Return the created message
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all messages for a specific chat
MessageRouter.get('/specific/:chatId', async (req, res) => {
  const { chatId } = req.params;

  try {
    // Find all messages in the specified chat, populate sender details, and sort by timestamp
    const messages = await Message.find({ chatId })
      .populate('senderId', 'name profilePicture')  // Populate sender details (e.g., name, profile picture)
      .populate('receiverId', 'name profilePicture')
      .sort({ timestamp: 1 });  // Sort by timestamp in ascending order (oldest first)

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update message status (sent, delivered, or read)
MessageRouter.patch('/status/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;  // Status can be 'sent', 'delivered', or 'read'
  console.log(req.body, "Status")
  console.log(req.params, "ID")
  try {
    // Validate the status value
    if (!['sent', 'delivered', 'read'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update the status of the message
    const updatedMessage = await Message.findByIdAndUpdate(id, { status }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({ error: 'Message not found' }); 
    }

    // Return the updated message
    res.json(updatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default MessageRouter;
