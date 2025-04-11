import mongoose, { model, Schema } from "mongoose";
import { TAppointment } from "./appointment.interface";

const appointmentSchema = new Schema<TAppointment>({
  donor: {
    type: String,
    required: true,
  },
  applicant: {
    type: String,
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
  patientGender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required:true,
  },
  contact_number: {
    type: String,
    required:true,
  },
  blood_group: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  disease: {
    type: String,
    required:false,
  },
  additional_notes: {
    type: String,
    required:false,
  },
  isDeleted: {
    type: Boolean,
    default:false,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default:"Pending",
  }
});

export const Appointment = model<TAppointment>(
  "Appointment",
  appointmentSchema
);
