import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "./user.service";

//create new user
const RegisterUser = catchAsync(async (req, res) => {
  const payload = req?.body;
  const result = await userServices.registerNewUser(payload);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User registration successfull",
    data: result,
  });
});

//update users details 
const updateUsersDetails = catchAsync(async (req, res) => {
  const payload = req?.body;
  const id = req?.params?.id;
  console.log(payload, ' ' , id);
  if (payload && id) {
    const result = await userServices.updateUserInfo(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Users details updated successfully",
      data:result
    })
  }

})

//get user info by user email (self)
const selfProfileInfo = catchAsync(async (req, res) => {
  const email = req?.query?.email || null;
  if (!email) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Details not found",
      data: [],
    });
  } else {
    const result = await userServices.getUserInfo(email as string);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Profile details found",
      data: result,
    });
  }
});

//view user details (others profile)
const getUserDetails = catchAsync(async (req, res) => {
  const id = req?.params?.userId;
  const result = await userServices.viewUsersDetails(id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User details found",
    data: result,
  });
});

//get users display image
const getUsersProfileImage = catchAsync(async (req, res) => {
  const email = req?.params?.email as string;
  if (!email) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "No profile found!",
      data: null,
    });
  }

  const result = await userServices.getUsersDP(email);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile found",
    data: result,
  });
});

//get users chat lists
const findUsersChatLists = catchAsync(async (req, res) => {
  const email = req?.params?.email;
  if (!email) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Request error please try again after login",
      data: null,
    });
  }

  const result = await userServices.getUserChatLists(email);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Chat lists fetched successfully",
    data: result,
  });
});

//get users id
const getUsersId = catchAsync(async (req, res) => {
  const email = req?.params?.email;
  if (!email) {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Request error please try again after login",
      data: null,
    });
  }
  const result = await userServices.getUsersId(email);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "users ID fetched successfully",
    data: result,
  });
});

//get donors lists
const getDonorLists = catchAsync(async (req, res) => {
  const result = await userServices.getDonorsLists();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "donors list fetched successfully",
    data: result,
  });
});



export const userController = {
  RegisterUser,
  updateUsersDetails,
  selfProfileInfo,
  getUserDetails,
  findUsersChatLists,
  getUsersProfileImage,
  getUsersId,
  getDonorLists,
};
