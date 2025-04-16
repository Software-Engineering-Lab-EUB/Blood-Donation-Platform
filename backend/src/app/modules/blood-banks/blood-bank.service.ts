import { BloodBank } from "./blood-bank.model";
import { TBloodBank } from "./blood-banks.interface";

//add new blood bank
const createBloodBank = async (data: TBloodBank) => {
  const result = await BloodBank.create(data);
  return result;
};

//get blood banks 
const getBloodBanks = async () => {
  const result = await BloodBank.find();
  return result;
};

//blood bank details
const getBloodBankDetails = async (id:string) => {
  const result = await BloodBank.findById(id);
  return result;
}

//edit existing blood bank
const updateBloodBank = async (id: string, payload: TBloodBank) => {
    const result = await BloodBank.findOneAndUpdate({_id: id }, payload,{new:true});
    return result;
}

//delete a blood bank
const deleteBloodBank = async (id: string) => {
    const result = await BloodBank.findByIdAndDelete(id);
    return result;
}


export const bloodBankServices = {
  createBloodBank,
  getBloodBanks,
  getBloodBankDetails,
  updateBloodBank,
  deleteBloodBank,
};
