import { serverBaseUrl } from "@/app/utils/serverUrl";



//get all blood banks
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

//add new blood bank
export const addNewBloodBank = async (data: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/blood-banks/add-new`, {
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
