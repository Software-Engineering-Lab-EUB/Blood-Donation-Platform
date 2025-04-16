
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bloodBankServices } from "../blood-banks/blood-bank.service";
import { campaignServices } from "../campaign/campaign.service";
import { userServices } from "../user/user.service";
import { adminServices } from "./admin.service";

//admin login 
const adminLogin = catchAsync(async (req, res) => {
  const { id, password } = req?.body;
  if (id == process.env.ADMIN_ID && password == process.env.ADMIN_PASS) {
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Admin Login Granted",
      data:[]
    })
  }
  else {
    sendResponse(res, {
      success: false,
      statusCode: 400,
      message: "Access Denied!",
      data:null
    })
  }
})

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

//update users details 
const updateUserDetails = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  const payload = req?.body;
  console.log('user update request aise');
  console.log(id , payload);
  if (id && payload) {
    const result = await userServices.updateUserInfo(id, payload);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "user's details updated successfully",
      data: result,
    });
  }
});


//get all posts
const getUsersPosts = catchAsync(async (req, res) => {
  const result = await adminServices.getAllPosts();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user's posts fetched successfully",
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


 //add new campaign 
const addNewCampaign = catchAsync(async (req, res) => {
    const payload = req?.body;
    if (payload) {
        const result = await campaignServices.createCampaign(payload);
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: 'Campaign added successfully',
            data:result
        })
    }
})

//get campaign details
const getCampaignDetails = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  if (id) {
    const result = await campaignServices.getCampaignDetails(id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Campaign details fetched successfully",
      data: result,
    });
  }
});

//get all campaigns list
const getCampaignsList = catchAsync(async (req, res) => {
    const result = await campaignServices.getCampaigns();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Campaigns list fetched successfully",
      data: result,
    });
});

// update campaign 
const updateCampaign = catchAsync(async (req, res) => {
    const id = req?.params?.id;
    const payload = req?.body;
    if (id && payload) {
        const result = await campaignServices.updateCampaign(id,payload);
        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Campaign updated successfully",
          data: result,
        });
    }
})

//delete a campaign
const deleteCampaign = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  if (id) {
    const result = await campaignServices.deleteCampaign(id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Campaign deleted successfully",
      data: result,
    });
  }
});

//add new blood banks
const addNewBloodBank = catchAsync(async (req, res) => {
    const data = req?.body;
    if (!data) {
        sendResponse(res, {
            success: false,
            statusCode: 400,
            message: "Failed",
            data:null
        })
    }
    const result = await bloodBankServices.createBloodBank(data);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "New blood bank added successfully",
        data:result
    })
})

//get blood bank details
const getBloodBankDetails = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  if (id) {
    const result = await bloodBankServices.getBloodBankDetails(id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Blood banks details fetched successfully",
      data: result,
    });
  }
});

// update blood bank 
const updateBloodBank = catchAsync(async (req, res) => {
    const id = req?.params?.id;
    const payload = req?.body;
    if (id && payload) {
        const result = await bloodBankServices.updateBloodBank(id,payload);
        sendResponse(res, {
          success: true,
          statusCode: 200,
          message: "Blood bank updated successfully",
          data: result,
        });
    }
})

//delete a blood bank
const deleteBloodBank = catchAsync(async (req, res) => {
  const id = req?.params?.id;
  if (id) {
    const result = await bloodBankServices.deleteBloodBank(id);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Blood Bank deleted successfully",
      data: result,
    });
  }
});
export const adminControllers = {
  adminLogin,
  getAllUsersList,
  getUsersDetails,
  updateUserDetails,
  getUsersPosts,
  getAllAppointments,
  addNewCampaign,
  getCampaignDetails,
  getCampaignsList,
  updateCampaign,
  deleteCampaign,
  addNewBloodBank,
  getBloodBankDetails,
  updateBloodBank,
  deleteBloodBank,
};
