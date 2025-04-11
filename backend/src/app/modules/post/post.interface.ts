import { Types } from "mongoose";

export type TPost = {
  user: Types.ObjectId;
  patientName: string;
  patientAge: number;
  gender: "Male" | "Female" | "Other";
  bloodGroup: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  dateNeeded: Date;
  location: string;
  contactInfo: string;
  notes?: string;
};
