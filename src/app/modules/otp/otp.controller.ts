import httpStatus from "http-status-codes";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { catchHandler } from "../../utils/catchHandler";
import { sendResponse } from "../../utils/sendResponse";
import { OTPServices } from "./otp.service";

const sendOTP = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {email,name} = req.body;
    await OTPServices.sendOTP(email,name)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP sent successfully",
      data: null,
    });
  }
);
const verifyOTP = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {email,otp} = req.body;
    await OTPServices.verifyOTP(email,otp)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "OTP verified successfully",
      data: null,
    });
  }
);
export const OTPController = {
  sendOTP,
  verifyOTP,
};
