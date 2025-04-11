import { sendAppointmentNotification } from "../../utils/sendEmailNotification";
import { User } from "../user/user.model";
import { TAppointment } from "./appointment.interface";
import { Appointment } from "./appointment.model";

//create appointment schedule 
const createAppointmentSchedule = async (formData:TAppointment) => {
  const result = await Appointment.create(formData);
  if (result) {
    const donor = await User.findById(formData?.donor);
    const donorEmail = donor?.email;
    sendAppointmentNotification(donorEmail as string);
  }
  return result;
}

//get appointment schedule
const getAllAppointments = async (id: string) => {
  const result = await Appointment.find({ $or: [{ donor: id }, { applicant: id }] });
  return result;
}

//update appointment status
const updateAppointmentStatus = async (appointmentId: string, status: string) => {
  const result = await Appointment.findOneAndUpdate(
    { _id: appointmentId },
    { status: status },
    { new: true }
  );
  return result;
}

export const appointmentServices = {
  createAppointmentSchedule,
  getAllAppointments,
  updateAppointmentStatus,
};