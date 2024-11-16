import mongoose from "mongoose";

const GroupChatSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  }, // URL for group icon
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  }, // Group admin
  createdAt: {
    type: Date,
    default: Date.now
  },
}, { timestamps: true });

export const Group = mongoose.model('Group', GroupChatSchema);
