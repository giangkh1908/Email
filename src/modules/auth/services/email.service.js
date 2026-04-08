import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return info;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

export async function sendOtpEmail({ to, otp }) {
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

  return sendEmail({
    to,
    subject: "Mã xác minh đăng ký - AI Email Agent",
    html,
  });
}
