import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile', // Refers to the user profile of the participants
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message', // Refers to the last message in this chat
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index to ensure better performance when querying participants
chatSchema.index({ participants: 1 });

// Optional: Prevent duplicate chats between two users by enforcing sorted order
chatSchema.pre('save', function (next) {
  this.participants.sort(); // Ensure participants are sorted to avoid duplicates
  next();
});

export const Chat = mongoose.model('Chat', chatSchema);
