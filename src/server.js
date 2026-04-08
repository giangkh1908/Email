import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/mongo.js";

dotenv.config();
const port = process.env.PORT || 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("AI Email Agent Server is running!");
});

const startServer = async () => {
  try {
    // connect database
    await connectDB();

    app.listen(port, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Lỗi khi khởi động server:", error);
    process.exit(1);
  }
};

startServer();
