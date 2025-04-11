import { model, Schema } from "mongoose";
import { TBloodBank } from "./blood-banks.interface";

const bloodBankSchema = new Schema<TBloodBank>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    registration_id: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
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

export const BloodBank = model<TBloodBank>("BloodBank", bloodBankSchema);
