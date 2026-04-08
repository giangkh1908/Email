import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_ACCESS_EXPIRES, JWT_REFRESH_EXPIRES } from "../constants/jwt.constants.js";

export const tokenService = {
  generateAccessToken: (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES });
  },

  generateRefreshToken: (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES });
  },

  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
};
