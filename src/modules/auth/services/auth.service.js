import { User } from "../models/user.model.js";
import { tokenService } from "./token.service.js";

export const authService = {
  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Email hoặc mật khẩu không đúng");
      error.status = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error("Email hoặc mật khẩu không đúng");
      error.status = 401;
      throw error;
    }

    const accessToken = tokenService.generateAccessToken(user._id);
    const refreshToken = tokenService.generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    };
  },

  refreshToken: async (refreshTokenFromCookie) => {
    const decoded = tokenService.verifyRefreshToken(refreshTokenFromCookie);
    if (!decoded) {
      const error = new Error("Refresh token không hợp lệ hoặc đã hết hạn");
      error.status = 401;
      throw error;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      const error = new Error("Người dùng không tồn tại");
      error.status = 401;
      throw error;
    }

    if (user.refreshToken !== refreshTokenFromCookie) {
      const error = new Error("Refresh token không hợp lệ");
      error.status = 401;
      throw error;
    }

    const newAccessToken = tokenService.generateAccessToken(user._id);
    const newRefreshToken = tokenService.generateRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  logout: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Người dùng không tồn tại");
      error.status = 404;
      throw error;
    }

    user.refreshToken = null;
    await user.save();

    return { message: "Đăng xuất thành công" };
  },

  getProfile: async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("Không tìm thấy người dùng");
      error.status = 404;
      throw error;
    }
    return user.toJSON();
  },
};
