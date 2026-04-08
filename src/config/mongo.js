import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      maxPoolSize: 1500,
    });
    console.log("Liên kết DB thành công!");
  } catch (error) {
    console.error("Lỗi khi kết nối DB:", error);
    process.exit(1);
  }
};