import { TCampaign } from "./campaign.interface";
import { Campaign } from "./campaign.model";

//add new campaign
const createCampaign = async (payload: TCampaign) => {
    const result = await Campaign.create(payload);
    return result;
}

//campaign details
const getCampaignDetails = async (id:string) => {
  const result = await Campaign.findById(id);
  return result;
}

//get all campaigns 
const getCampaigns = async () => {
  const result = await Campaign.find();
  return result;
};

//edit existing campaign
const updateCampaign = async (id: string, payload: TCampaign) => {
    const result = await Campaign.findOneAndUpdate({_id: id }, payload,{new:true});
    return result;
}

//delete a campaign
const deleteCampaign = async (id: string) => {
    const result = await Campaign.findByIdAndDelete(id);
    return result;
}

export const campaignServices = {
    createCampaign,
    getCampaignDetails,
    getCampaigns,
    updateCampaign,
    deleteCampaign
}