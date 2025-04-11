import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bloodBankServices } from "./blood-bank.service";
import { TBloodBank } from "./blood-banks.interface";


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
    const result = await bloodBankServices.createBloodBank(data as TBloodBank);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "New blood bank added successfully",
        data:result
    })
})


//get blood banks list
const getBloodBanksLists = catchAsync(async (req, res) => {
    const result = await bloodBankServices.getBloodBanks();
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Blood banks list fetched successfully",
      data: result,
    });
})

export const bloodBankControllers = {
    addNewBloodBank,
    getBloodBanksLists,
}