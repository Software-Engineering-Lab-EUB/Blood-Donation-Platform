import { serverBaseUrl } from "@/app/utils/serverUrl";


//update users details
export const updateUserProfile = async (id: string, updatedInfo: any) => {
  const response = await fetch(`${serverBaseUrl}/user/update/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedInfo),
  });
  const result = await response.json();
  return result;
};

//get user info by email (self)
export const getUserInfoByEmail = async (email: string) => {
  try {
    const response = await fetch(`${serverBaseUrl}/user/info?email=${email}`);
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

//get user info by id (others profile)
export const getUsersProfileInfo = async (id: string) => {
  try {
    const response = await fetch(`${serverBaseUrl}/user/profile-view/${id}`);
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

//get users profile image url
export const getUersProfileImage = async (email: string) => {
  try {
    const response = await fetch(
      `${serverBaseUrl}/user/profile-image/${email}`
    );
    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};

//get user id by user email
export const getUSerId = async (email:string) => {
  try {
    const response = await fetch(`${serverBaseUrl}/user/user-id/${email}`);
    const data = await response.json();
    console.log(data);
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};


//get all donors lists (also Both role)
export const getDonorsLists = async () => {
  try {
    const response = await fetch(`${serverBaseUrl}/user/donors-lists`);
    const data = await response.json();
    console.log(data);
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};
