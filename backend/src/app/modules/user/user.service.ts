import { TUser } from "./user.interface";
import { User } from "./user.model";

//register new user to mongodb
const registerNewUser = async (payload: TUser) => {
  const result = await User.create(payload);
  console.log(result);
  return result;
};

// Get users email by blood group
const getUsersByBloodGroup = async (bloodGroup: string) => {
  const result = await User.find(
    { blood_group: bloodGroup, notificationPreference: "Yes" },
    { email: 1 }
  );
  return result;
};

//get user info (self)
const getUserInfo = async (email: string) => {
  const result = await User.find({ email: email });
  return result;
};

//get user info (others)
const viewUsersDetails = async (id: any) => {
  const result = await User.findById(id, {
    conversation: 0,
  });
  return result;
};

//get users display-image
const getUsersDP = async (email: string) => {
  const result = await User.findOne({ email: email }, { photoURL: 1 });
  return result;
};

//update user info
const updateUserInfo = async (id: any, payload: any) => {
  const result = await User.findByIdAndUpdate({ _id: id }, payload, {
    new: true,
  });
  console.log(result);
};

//get users chat lists
const getUserChatLists = async (email: any) => {
  const result = await User.findOne(
    { email: email },
    { conversation: 1 }
  ).populate("conversation");
  return result;
};

//get users _id using email
const getUsersId = async (email: string) => {
  const result = await User.findOne({ email: email }, { _id: 1 });
  return result;
};

//get users search lists
const getDonorsLists = async () => {
  const result = await User.find(
    { $or: [{ role: "Donor" }, { role: "Both" }] },
    { conversation: 0, phone: 0 }
  );
  return result;
};

export const userServices = {
  registerNewUser,
  getUsersByBloodGroup,
  getUserInfo,
  updateUserInfo,
  viewUsersDetails,
  getUserChatLists,
  getUsersDP,
  getUsersId,
  getDonorsLists,
};
