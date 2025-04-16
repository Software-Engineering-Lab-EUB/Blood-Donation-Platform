import { serverBaseUrl } from "@/utils/serverUrl";


//get all appointments list
export const getAllAppointments = async () => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/all-appointments`);
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};
