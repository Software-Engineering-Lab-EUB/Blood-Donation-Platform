import { Appointment } from "../appointment/appointment.model";
import { Post } from "../post/post.model";
import { User } from "../user/user.model";

//get all users from db
const getAllUsers = async () => {
  const result = await User.find();
  console.log(result);
  return result;
};

//get all user posts
const getAllPosts = async () => {
  const result = await Post.find();
  return result;
};

//get all appointments
const getAllAppointments = async () => {
  const result = await Appointment.find();
  return result;
};

//get user details 
const getUsersDetails = async (id:string) => {
  const result = await User.findById(id);
  return result;
}

export const adminServices = {
  getAllUsers,
  getAllPosts,
  getAllAppointments,
 getUsersDetails,
};
