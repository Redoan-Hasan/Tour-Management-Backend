/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { User } from "../user/user.model";
import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { Tour } from "../tour/tour.model";
import { Booking } from "./booking.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { sslServices } from "../SSLCommerz/sslCommerz.service";
import { ISSLCommerz } from "../SSLCommerz/sslCommerz.interface";

const getTransactionId = () => {
  return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transactionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const user = await User.findById(userId);
    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `${
          !user?.phone && !user?.address
            ? "please add your phone number and address first"
            : !user?.phone
            ? "please add your phone number first"
            : "please add your address first"
        }`
      );
    }
    const tour = await Tour.findById(payload.tour).select("costFrom");
    if (!tour?.costFrom) {
      throw new AppError(httpStatus.BAD_REQUEST, "No Tour Cost Found");
    }
    if (!payload.guestCount || payload.guestCount <= 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Guest count is required and must be greater than 0"
      );
    }
    const amount = Number(tour.costFrom) * payload.guestCount;
    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session }
    );
    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId,
          amount,
        },
      ],
      { session }
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      booking[0]._id,
      {
        payment: payment[0]._id,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userEmail = (updatedBooking?.user as any)?.email;
    const userName = (updatedBooking?.user as any)?.name;
    const userAddress = (updatedBooking?.user as any)?.address;
    const userPhone = (updatedBooking?.user as any)?.phone;

    const sslPayload: ISSLCommerz = {
      amount: amount,
      transactionId: transactionId,
      name: userName,
      email: userEmail,
      address: userAddress,
      phoneNumber: userPhone,
    };
    const sslPayment = await sslServices.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();
    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const getUserBooking = async () => {
  return;
};
const getBookingById = async () => {
  return;
};
const updateBookingStatus = async () => {
  return;
};
const getAllBookings = async () => {
  return;
};

export const BookingServices = {
  createBooking,
  getUserBooking,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
};
