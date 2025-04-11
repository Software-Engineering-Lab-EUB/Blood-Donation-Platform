import mongoose, { model, Schema, Types } from "mongoose";
import { TUser } from "./user.interface";

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    dob: {
      day: { type: Number, required: true },
      month: { type: Number, required: true },
      year: { type: Number, required: true },
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Others"],
      required: true,
    },
    phone: { type: String, required: true },
    photoURL: {
      type:String
    },
    nid: { type: Number, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isSmoker: { type: Boolean, required: true },
    critical_disease: { type: Boolean, required: true },
    critical_disease_description: { type: String, required: false },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: false,
      },
    ],
    conversation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: false,
      },
    ],
    isAvailableForDonation: { type: Boolean, default: true, required: false },
    notificationPreference: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    donation_eligibility: {
      type: String,
      enum: ["Eligible", "Temporarily Ineligible", "Permanently Ineligible"],
      required: false,
    },
    role: {
      type: String,
      enum: ["Donor", "Recipient", "Both"],
      required: true,
    },
    isRegistered: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    isPhoneNumberVisible: { type: Boolean, required: true },
    isBanned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<TUser>("User", userSchema);
