import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) throw new Error("Mongo Url is not set");
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("MongoDB Connected Successfully", conn.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Failed", error.message);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};
