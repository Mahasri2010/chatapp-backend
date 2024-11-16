import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String, // URL or file path
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export const File = mongoose.model('File', FileSchema);
