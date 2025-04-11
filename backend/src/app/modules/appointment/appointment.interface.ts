import { Types } from "mongoose";

export type TAppointment = {
  donor: string;
  applicant: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  contact_number: string;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  location: string;
  date: Date;
  disease?: string;
  additional_notes?: string;
  isDeleted?: boolean;
  status: "Pending" | "Accepted" | "Rejected";
};
