import { BloodBank } from "./blood-bank.model";
import { TBloodBank } from "./blood-banks.interface";

//add new blood bank
const createBloodBank = async (data: TBloodBank) => {
  const result = await BloodBank.create(data);
  return result;
};

//get blood banks details
const getBloodBanks = async () => {
  const result = await BloodBank.find();
  return result;
};

export const bloodBankServices = {
  createBloodBank,
  getBloodBanks,
};
