import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const { MONGO_URI } = process.env;
    if (!MONGO_URI) throw new Error("Mongo Url is not set");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully", conn.connection.host);
  } catch (error) {
    console.error("MongoDB Connection Failed", error.message);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};
