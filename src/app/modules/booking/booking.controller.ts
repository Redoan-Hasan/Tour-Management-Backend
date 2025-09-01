import  httpStatus  from 'http-status-codes';
import { catchHandler } from "../../utils/catchHandler";
import { sendResponse } from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";
import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

const createBooking = catchHandler(async (req: Request, res: Response) =>{
    const decodedToken = req?.user as JwtPayload;
    const booking = await BookingServices.createBooking(req.body, decodedToken.id);
    sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking created successfully",
    data: booking,
  });
});
const getUserBooking = catchHandler(async(req:Request, res:Response)=>{
    const bookings = await BookingServices.getUserBooking();
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings,
        });
})
const getBookingById = catchHandler(async(req:Request, res:Response)=>{
    const booking = await BookingServices.getBookingById();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking retrieved successfully",
        data: booking,
    });
})
const updateBookingStatus = catchHandler(async(req:Request, res:Response)=>{
    const updatedBooking = await BookingServices.updateBookingStatus();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Booking updated successfully",
        data: updatedBooking,
    });
})
const getAllBookings = catchHandler(async(req:Request, res:Response)=>{
    const bookings = await BookingServices.getAllBookings();
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All bookings retrieved successfully",
        data: bookings,
    });
});

export const BookingController = {
  createBooking,
  getUserBooking,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
