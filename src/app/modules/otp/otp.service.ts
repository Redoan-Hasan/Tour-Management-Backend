import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import { sendEmail } from "../../utils/sendEmail";
import AppError from "../../errorHelpers/appError";
import httpStatus from "http-status-codes";
import { User } from "../user/user.model";

const OTP_EXPIRATION = 2 * 60; // 2minute
const generateOTP = (length = 6) => {
  const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
  return otp;
};

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User with this email does not exist"
    );
  }
  if (user.isVerified) {
    throw new AppError(httpStatus.CONFLICT, "This account is already verified");
  }
  const otp = generateOTP();
  const redisKey = `otp:${email}`;
  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: OTP_EXPIRATION,
    },
  });
  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: {
      name,
      otp,
    },
  });
  return;
};
const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User with this email does not exist"
    );
  }
  if (user.isVerified) {
    throw new AppError(httpStatus.CONFLICT, "This account is already verified");
  }
  const redisKey = `otp:${email}`;
  const storedOtp = await redisClient.get(redisKey);
  if (!storedOtp) {
    throw new AppError(httpStatus.BAD_REQUEST, "OTP has expired or is invalid");
  }
  if (storedOtp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }
  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del(redisKey),
  ]);
  return;
};

export const OTPServices = {
  sendOTP,
  verifyOTP,
};
