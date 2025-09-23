import httpStatus from "http-status-codes";
import { Request, Response } from "express";
import { catchHandler } from "../../utils/catchHandler";
import { statsService } from "./stats.service";
import { sendResponse } from "../../utils/sendResponse";

const getBookingStats = catchHandler(async (req: Request, res: Response) => {
  const bookingStats = await statsService.getBookingStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking Stats fetched successfully",
    data: bookingStats,
  });
});
const getPaymentStats = catchHandler(async (req: Request, res: Response) => {
  const paymentStats = await statsService.getPaymentStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment Stats fetched successfully",
    data: paymentStats,
  });
});
const getUserStats = catchHandler(async (req: Request, res: Response) => {
  const userStats = await statsService.getUserStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Stats fetched successfully",
    data: userStats,
  });
});
const getTourStats = catchHandler(async (req: Request, res: Response) => {
  const TourStats = await statsService.getTourStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Tour Stats fetched successfully",
    data: TourStats,
  });
});

export const statsController = {
  getBookingStats,
  getPaymentStats,
  getUserStats,
  getTourStats,
};
