/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { BOOKING_STATUS } from "../booking/booking.interface";
import { Booking } from "../booking/booking.model";
import { PAYMENT_STATUS } from "./payment.interface";
import { Payment } from "./payment.model";
import { ISSLCommerz } from "../SSLCommerz/sslCommerz.interface";
import { sslServices } from "../SSLCommerz/sslCommerz.service";
import { generatePDFInvoice } from "../../utils/invoice";
import { IInvoiceData } from "../../utils/utilsTypes";
import { IUser } from "../user/user.interface";
import { ITour } from "../tour/tour.interface";
import { sendEmail } from "../../utils/sendEmail";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });
  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }
  const booking = await Booking.findById(payment.booking);
  const userEmail = (booking?.user as any)?.email;
  const userName = (booking?.user as any)?.name;
  const userAddress = (booking?.user as any)?.address;
  const userPhone = (booking?.user as any)?.phone;

  const sslPayload: ISSLCommerz = {
    amount: payment.amount,
    transactionId: payment.transactionId,
    name: userName,
    email: userEmail,
    address: userAddress,
    phoneNumber: userPhone,
  };
  const sslPayment = await sslServices.sslPaymentInit(sslPayload);
  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};
const successPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.PAID,
      },
      { runValidators: true, session }
    );
    const updatedBooking = await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.COMPLETE,
      },
      { new: true, runValidators: true, session }
    )
      .populate("user", "name email")
      .populate("tour", "title");
    if (!updatedPayment) {
      throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
    }
    if (!updatedBooking) {
      throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
    }
    const invoiceData: IInvoiceData = {
      transactionId: updatedPayment?.transactionId,
      bookingDate: updatedBooking.createdAt,
      userName: (updatedBooking.user as unknown as IUser).name,
      tourTitle: (updatedBooking.tour as unknown as ITour).title,
      guestCount: updatedBooking.guestCount,
      totalAmount: updatedPayment.amount,
    };

    const pdfBuffer = await generatePDFInvoice(invoiceData);
    const pdfCloudinaryResult = await uploadBufferToCloudinary(
      pdfBuffer,
      "invoice"
    );
    if (!pdfCloudinaryResult) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Error uploading invoice to cloudinary"
      );
    }
    // console.log(pdfCloudinaryResult);
    await Payment.findByIdAndUpdate(
      updatedPayment?._id,
      { invoiceUrl: pdfCloudinaryResult.secure_url },
      { runValidators: true, session }
    );

    await sendEmail({
      to: (updatedBooking.user as unknown as IUser).email,
      subject: "Your Booking Invoice",
      templateName: "invoice",
      templateData: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    //   .populate("user", "name email phone address")
    //   .populate("tour", "title costFrom")
    //   .populate("payment");

    await session.commitTransaction();
    session.endSession();
    return {
      success: true,
      message: "Payment successful",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const failPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.FAILED,
      },
      { runValidators: true, session }
    );
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.FAILED,
      },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment failed",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const cancelPayment = async (query: Record<string, string>) => {
  const session = await Booking.startSession();
  session.startTransaction();
  try {
    const updatedPayment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      {
        status: PAYMENT_STATUS.CANCELLED,
      },
      { runValidators: true, session }
    );
    await Booking.findByIdAndUpdate(
      updatedPayment?.booking,
      {
        status: BOOKING_STATUS.CANCEL,
      },
      { runValidators: true, session }
    );

    await session.commitTransaction();
    session.endSession();
    return {
      success: false,
      message: "Payment cancelled",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getInvoiceDownloadURL = async(paymentId: string) => {
  const payment = await Payment.findById(paymentId);
  if(!payment){
    throw new AppError(httpStatus.NOT_FOUND,"Payment not found");
  }
  if(!payment.invoiceUrl){
    throw new AppError(httpStatus.BAD_REQUEST,"Invoice URL not found");
  }
  return payment.invoiceUrl;
}

export const PaymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  initPayment,
  getInvoiceDownloadURL
};
