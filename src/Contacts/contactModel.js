import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth", // Reference to the Auth model
      required: true,
    },
    profileId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // Reference to the Profile model
      // required: true,
    },
    contact_name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String, // e.g., "accepted", "blocked", "pending"
      enum:['pending','accepted','blocked'],
      default: 'pending',
    },
    contact_number: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Invalid phone number"], // Simple validation for 10-digit phone number
    }
  },
  { timestamps: true }
);

// Create a compound unique index for authId and contact_number
contactSchema.index({ authId: 1, contact_number: 1 }, { unique: true });

export const Contact = mongoose.model("Contact", contactSchema);


