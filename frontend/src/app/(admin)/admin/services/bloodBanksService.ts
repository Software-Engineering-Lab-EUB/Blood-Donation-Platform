import { serverBaseUrl } from "@/utils/serverUrl";

// Get all blood banks 
export const getAllBloodBanks = async () => {
  try {
    const response = await fetch(`${serverBaseUrl}/blood-banks/get-all`);
    const data = await response.json();
    console.log(data);
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

// Add new blood bank
export const addNewBloodBank = async (data: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/add-blood-bank`, {
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

// Get blood bank details by ID
export const getBloodBankDetails = async (id: string) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/blood-bank-details/${id}`);
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

// Update blood bank details by ID
export const updateBloodBank = async (id: string, data: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/update-blood-bank/${id}`, {
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

// Delete blood bank by ID
export const deleteBloodBank = async (id: string) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/delete-blood-bank/${id}`, {
      method: "DELETE",
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
  }
};