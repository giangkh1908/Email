import { authService } from "../services/auth.service.js";
import { otpService } from "../services/otp.service.js";
import { COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_NAME } from "../constants/cookie.constants.js";

export const authController = {
  sendOtp: async (req, res, next) => {
    try {
      const result = await otpService.sendOtp(req.body);
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  verifyOtp: async (req, res, next) => {
    try {
      const result = await otpService.verifyOtp(req.body);
      
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.tokens.refreshToken, COOKIE_OPTIONS);
      
      res.status(201).json({
        status: "success",
        data: {
          user: result.user,
          accessToken: result.tokens.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const result = await authService.login(req.body);
      
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);
      
      res.status(200).json({
        status: "success",
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  refreshToken: async (req, res, next) => {
    try {
      const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
      
      if (!refreshToken) {
        return res.status(401).json({
          status: "error",
          message: "Refresh token không tìm thấy",
        });
      }
      
      const result = await authService.refreshToken(refreshToken);
      
      res.cookie(REFRESH_TOKEN_COOKIE_NAME, result.refreshToken, COOKIE_OPTIONS);
      
      res.status(200).json({
        status: "success",
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      const result = await authService.logout(req.user.userId);
      
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      
      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile: async (req, res, next) => {
    try {
      const user = await authService.getProfile(req.user.userId);
      res.status(200).json({
        status: "success",
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  },
};
