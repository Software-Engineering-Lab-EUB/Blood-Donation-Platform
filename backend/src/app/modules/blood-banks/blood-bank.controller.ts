import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { bloodBankServices } from "./blood-bank.service";

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
    getBloodBanksLists,
}