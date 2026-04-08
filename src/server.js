import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./database/mongo.js";
import { redis } from "./database/redis.js";
import authRoutes from "./modules/auth/routes/auth.routes.js";
import { emailQueueService } from "./modules/auth/services/email-queue.service.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("AI Email Agent Server is running!");
});

app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

const startServer = async () => {
  try {
    await connectDB();
    
    redis.ping().then(() => {
      console.log("✅ Redis connected successfully");
      emailQueueService.processQueue();
    }).catch((err) => {
      console.error("❌ Redis connection failed:", err);
    });

    app.listen(port, () => {
      console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Lỗi khi khởi động server:", error);
    process.exit(1);
  }
};

startServer();
