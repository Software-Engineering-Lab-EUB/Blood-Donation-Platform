import { serverBaseUrl } from "@/utils/serverUrl";

//get campaigns list
export const getCampaignsList = async () => {
  try {
    const response = await fetch(`${serverBaseUrl}/campaigns/get-all`);
    const data = await response.json();
    console.log(data);
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};