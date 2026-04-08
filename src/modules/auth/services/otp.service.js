import bcrypt from "bcrypt";
import redis from "../../../database/redis.js";
import { validateEmail } from "./email-validation.service.js";
import { emailQueueService } from "./email-queue.service.js";
import { tokenService } from "./token.service.js";
import { User } from "../models/user.model.js";

const OTP_TTL = 300;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN = 300;

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const otpService = {
  async sendOtp({ email, fullName, password }) {
    const validation = await validateEmail(email);
    if (!validation.valid) {
      const error = new Error(validation.reason);
      error.status = 400;
      throw error;
    }

    const resendKey = `otp:resend:${email}`;
    const canResend = await redis.get(resendKey);
    if (canResend) {
      const error = new Error("Vui lòng đợi 5 phút trước khi gửi lại");
      error.status = 429;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email đã được sử dụng");
      error.status = 400;
      throw error;
    }

    const otp = generateOTP();
    const otpData = {
      email,
      fullName,
      password,
      otp,
      attempts: 0,
    };

    const otpKey = `otp:register:${email}`;
    await redis.set(otpKey, JSON.stringify(otpData), "EX", OTP_TTL);

    await redis.set(resendKey, "1", "EX", RESEND_COOLDOWN);

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Mã xác minh đăng ký</h2>
        <p style="font-size: 16px; color: #555;">Mã xác minh của bạn là:</p>
        <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #777;">Mã này có hiệu lực trong <strong>5 phút</strong>.</p>
        <p style="font-size: 14px; color: #777;">Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email.</p>
      </div>
    `;

    await emailQueueService.enqueue({
      to: email,
      subject: "Mã xác minh đăng ký - AI Email Agent",
      html,
    });

    return { message: "Mã OTP đã được gửi đến email của bạn", expiresIn: OTP_TTL };
  },

  async verifyOtp({ email, otp }) {
    const otpKey = `otp:register:${email}`;
    const data = await redis.get(otpKey);

    if (!data) {
      const error = new Error("OTP đã hết hạn hoặc không tồn tại");
      error.status = 400;
      throw error;
    }

    const otpData = JSON.parse(data);

    if (otpData.attempts >= MAX_ATTEMPTS) {
      await redis.del(otpKey);
      const error = new Error("Bạn đã nhập sai quá 5 lần. Vui lòng gửi lại OTP.");
      error.status = 400;
      throw error;
    }

    if (otp !== otpData.otp) {
      otpData.attempts += 1;
      await redis.set(otpKey, JSON.stringify(otpData), "EX", OTP_TTL);
      const remaining = MAX_ATTEMPTS - otpData.attempts;
      const error = new Error(`Mã OTP không đúng. Còn ${remaining} lần thử`);
      error.status = 400;
      throw error;
    }

    await redis.del(otpKey);

    const hashedPassword = await bcrypt.hash(otpData.password, 10);
    const user = await User.create({
      email: otpData.email,
      password: hashedPassword,
      fullName: otpData.fullName,
      credits: { balance: 3, totalPurchased: 0, totalUsed: 0 },
    });

    const accessToken = tokenService.generateAccessToken(user._id);
    const refreshToken = tokenService.generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toJSON(),
      tokens: { accessToken, refreshToken },
    };
  },
};
