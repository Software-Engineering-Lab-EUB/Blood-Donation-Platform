import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { appointmentServices } from "./appointment.service";


//add new appointment
const addNewAppointmentSchedule = catchAsync(async (req, res) => {
  const formData = req?.body;
  console.log(formData);
  if (!formData) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Please fill the form again!",
      data:''
    })
  }
  const result = await appointmentServices.createAppointmentSchedule(formData);
   sendResponse(res, {
     success: true,
     statusCode: 200,
     message: "Appointment request successfully",
     data: result,
   });
})

//get appointments
const getAppointments = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  if (id) {
    const result = await appointmentServices.getAllAppointments(id as string);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "user based appointments fetched successfully",
      data:result
    })
  }
  console.log(id);
})

//update appointment status
const updateAppointmentStatus = catchAsync(async (req, res) => {
  const { appointmentId, status } = req?.body;
  if (appointmentId && status) {
    const result = await appointmentServices.updateAppointmentStatus(appointmentId, status);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Appointment status updated successfully",
      data:result
    })
  }
})

export const appointmentController = {
  addNewAppointmentSchedule,
  getAppointments,
  updateAppointmentStatus,
}