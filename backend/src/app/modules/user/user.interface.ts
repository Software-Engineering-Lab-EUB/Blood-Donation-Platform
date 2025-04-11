import { Types } from "mongoose";

export type TUser = {
  name: string;
  blood_group: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";
  dob: {
    day: number;
    month: number;
    year: number;
  };
  gender: "Male" | "Female" | "Others";
  phone: string;
  photoURL: string;
  isPhoneNumberVisible: boolean;
  nid: number;
  address: string;
  email: string;
  isSmoker: boolean;
  critical_disease: boolean;
  critical_disease_description?: string;
  posts?: Types.ObjectId[];
  conversation?: Types.ObjectId[];
  donationHistory?: Types.ObjectId[];
  isAvailableForDonation?: boolean;
  notificationPreference: "Yes" | "No";
  donation_eligibility?:
    | "Eligible"
    | "Temporarily Ineligible"
    | "Permanently Ineligible";
  role: "Donor" | "Recipient" | "Both";
  isRegistered?: boolean;
  isVerified?: false;
  isBanned?: false;
};
