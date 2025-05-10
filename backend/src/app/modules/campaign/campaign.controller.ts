import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { campaignServices } from "./campaign.service";


const getCampaignsList = catchAsync(async (req, res) => {
    const result = await campaignServices.getCampaigns();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Campaigns fetched successfully",
        data:result
    })
})

export const campaignControllers = {
    getCampaignsList,
}