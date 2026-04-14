import Joi from "joi";

export const sendOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().min(8).pattern(/[A-Z]/).pattern(/[0-9]/).required().messages({
    "string.min": "Mật khẩu phải có ít nhất 8 ký tự",
    "string.pattern.base": "Mật khẩu phải chứa ít nhất 1 chữ hoa và 1 số",
    "any.required": "Mật khẩu là bắt buộc",
  }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Mật khẩu xác nhận không khớp",
    "any.required": "Xác nhận mật khẩu là bắt buộc",
  }),
  fullName: Joi.string().min(2).max(100).required().messages({
    "string.min": "Tên phải có ít nhất 2 ký tự",
    "string.max": "Tên không được vượt quá 100 ký tự",
    "any.required": "Tên là bắt buộc",
  }),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    "string.length": "Mã OTP phải có 6 chữ số",
    "string.pattern.base": "Mã OTP phải là số",
    "any.required": "Mã OTP là bắt buộc",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email không hợp lệ",
    "any.required": "Email là bắt buộc",
  }),
  password: Joi.string().required().messages({
    "any.required": "Mật khẩu là bắt buộc",
  }),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    "any.required": "Refresh token là bắt buộc",
  }),
});
