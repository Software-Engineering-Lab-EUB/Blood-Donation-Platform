import { serverBaseUrl } from "@/utils/serverUrl";

// Add new campaign
export const addNewCampaign = async (data: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/add-campaign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

// Get campaign details by ID
export const getCampaignDetails = async (id: string) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/campaign-details/${id}`);
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

// Get all campaigns
export const getAllCampaigns = async () => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/all-campaigns`);
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

// Update campaign by ID
export const updateCampaign = async (id: string, data: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/update-campaign/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};

// Delete campaign by ID
export const deleteCampaign = async (id: string) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/delete-campaign/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};