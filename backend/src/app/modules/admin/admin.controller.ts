import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

//get all users list
const getAllUsersList = catchAsync(async (req, res) => {
  const result = await adminServices.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "users list fetched successfully",
    data: result,
  });
});

//get all posts
const getUsersPosts = catchAsync(async (req, res) => {
  const result = await adminServices.getAllPosts();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "users posts fetched successfully",
    data: result,
  });
});

//get all appointments
const getAllAppointments = catchAsync(async (req, res) => {
  const result = await adminServices.getAllAppointments();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Appointments fetched successfully",
    data: result,
  });
});

//get users details 
const getUsersDetails = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const result = await adminServices.getUsersDetails(id as string);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User details found",
    data:result,
  })
 })

export const adminControllers = {
  getAllUsersList,
  getUsersPosts,
  getAllAppointments,
  getUsersDetails,
};
