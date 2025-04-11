import { serverBaseUrl } from "@/utils/serverUrl";

//get all blood request posts list
export const getAllPosts = async () => {
  try {
    const response = await fetch(`${serverBaseUrl}/admin/all-posts`);
    const data = await response.json();
    console.log(data);
    return data?.data;
  } catch (error) {
    console.log(error);
  }
};
