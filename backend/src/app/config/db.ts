
import mongoose from "mongoose";
import config from ".";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.db_uri as string, {
      dbName: "blood_donation_platform",
    });
    console.log(`🔗 MongoDB Connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;