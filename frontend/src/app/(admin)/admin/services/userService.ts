import { serverBaseUrl } from "@/utils/serverUrl";

//get all users list
export const getAllUers = async () => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/all-users`);
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

//get user details
export const getUserDetails = async (id: string) => {
  try {
    console.log(id);
    const response = await fetch(`${serverBaseUrl}/admin/user-details/${id}`);
    
    if (!response.ok) {
      console.error(`Error: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    console.log(data);
    return data?.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

//update user's details 
export const updateUserDetails = async (id: string, data: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/update-user/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type":"application/json",
      },
      body:JSON.stringify(data),
    })
    const result = await response.json();
    return result;
  }
  catch (error) {
    console.log(error);
  }
}