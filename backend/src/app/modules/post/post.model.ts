import mongoose, { model, Schema } from "mongoose";
import { TPost } from "./post.interface";

const postSchema = new Schema<TPost>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  patientAge: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Others"],
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  dateNeeded: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  contactInfo: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
});

export const Post = model<TPost>("Post", postSchema);