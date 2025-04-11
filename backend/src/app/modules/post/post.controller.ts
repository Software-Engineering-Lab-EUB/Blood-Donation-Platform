import catchAsync from "../../utils/catchAsync";
import { sendEmailNotification } from "../../utils/sendEmailNotification";
import sendResponse from "../../utils/sendResponse";
import { userServices } from "../user/user.service";
import { postServices } from "./post.service";

//add blood request post
const addBloodNeededPost = catchAsync(async (req, res) => {
  const formData = req?.body;
  const result = await postServices.addBloodRquestPost(formData);
  if (result) {
    const blood_group = result?.bloodGroup;
    const usersEmails = await userServices.getUsersByBloodGroup(blood_group);
    const emailList = usersEmails.map((user) => user.email);
    console.log(emailList);
    await sendEmailNotification(emailList, blood_group, result?.location, result?.contactInfo);
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Posts created successfully",
      data: result,
    });
  }
});

export const postControllers = {
  addBloodNeededPost,
};
