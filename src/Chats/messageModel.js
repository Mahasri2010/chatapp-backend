import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat', // Refers to the chat this message belongs to
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', // Refers to the sender's profile
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'], // Status of the message
    default: 'sent'
  },
}, { timestamps: true });

messageSchema.index({ chatId: 1 }); // For chat-based lookups
export const Message = mongoose.model('Message', messageSchema);
