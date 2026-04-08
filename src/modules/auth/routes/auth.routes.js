import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../validations/validation.middleware.js";
import {
  sendOtpSchema,
  verifyOtpSchema,
  loginSchema,
  refreshTokenSchema,
} from "../validations/auth.validation.js";

const router = Router();

router.post(
  "/register/send-otp",
  validate(sendOtpSchema),
  authController.sendOtp
);

router.post(
  "/register/verify-otp",
  validate(verifyOtpSchema),
  authController.verifyOtp
);

router.post(
  "/login",
  validate(loginSchema),
  authController.login
);

router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken
);

router.post(
  "/logout",
  authMiddleware,
  authController.logout
);

router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);

export default router;
