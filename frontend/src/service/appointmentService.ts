
import { serverBaseUrl } from "@/utils/serverUrl";
import Cookies from "js-cookie";
const selfId = Cookies.get("selfId");

//add appointment request
export const postAppointmentRequest = async (donor: string, formData: any) => {
    formData = { applicant: selfId, donor: donor, ...formData };
    try {
      const response = await fetch(`${serverBaseUrl}/appointment/add-schedule`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
        const result = await response.json();
        return result;
  } catch (error) {
    console.log(error);
  }
};

//view appointments
export const viewAppointments = async () => {
  try {
    const response = await fetch(`${serverBaseUrl}/appointment/view/${selfId}`);
    const result  = await response.json();
    return {result , selfId};
  } catch (error) {
    console.log(error);
    return {result:null,selfId:undefined}
  }
};

//update appointment status
export const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const response = await fetch(`${serverBaseUrl}/appointment/update-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointmentId, status }),
      });
        const result = await response.json();
        return result;
  } catch (error) {
    console.log(error);
  }
};