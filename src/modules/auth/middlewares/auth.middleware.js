import { tokenService } from "../services/token.service.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "error",
      message: "Vui lòng đăng nhập để tiếp tục",
    });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decoded = tokenService.verifyAccessToken(accessToken);

    if (!decoded) {
      return res.status(401).json({
        status: "error",
        message: "Access token không hợp lệ hoặc đã hết hạn",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Access token không hợp lệ",
    });
  }
};
