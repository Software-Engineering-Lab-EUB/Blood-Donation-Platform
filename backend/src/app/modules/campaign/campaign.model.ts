import { model, Schema } from "mongoose";
import { TCampaign } from "./campaign.interface";

const campaigSchema = new Schema<TCampaign>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    host: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    start_time: {
      type: String,
      required:true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Campaign = model<TCampaign>("Campaign", campaigSchema);
