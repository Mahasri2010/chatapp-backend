import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({

  name: {
    type:String,
    required:true,
    trim:true
  },
  authId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth',
    unique:true,
    required:true
  },
  profilePicture: {
    type: String, // Store the URL or path to the uploaded profile picture
    default: '', // Default to empty if not provided
  },
  lastSeen: {
    type: Date, // Stores the last seen timestamp
    default: null,
  },
  online: {
    type: Boolean, // Stores online status (true/false)
    default: false,
  },
  about: {
    type: String,
    maxlength: 200, // Optional: Limit length of the 'about' field
    default: 'Hey there! I am using MernChat',
  },
  isRegistered: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    // required: true,
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v); // Validates 10-digit phone numbers
      },
      message: 'Phone number must be 10 digits',
    }
  }
  })


export const Profile = mongoose.model('Profile', ProfileSchema)



