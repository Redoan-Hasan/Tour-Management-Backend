import httpStatus from "http-status-codes";
import AppError from "../errorHelpers/appError";
import PDFDocument from "pdfkit";
import { IInvoiceData } from "./utilsTypes";

export const generatePDFInvoice = (invoiceData: IInvoiceData) : Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];
      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (error) => reject(error));

      // --- HEADER ---
      doc
        .fontSize(26)
        .fillColor("#333333")
        .text("Invoice", { align: "center" })
        .moveDown(0.5);

      doc
        .fontSize(12)
        .fillColor("#555555")
        .text(`Transaction ID: ${invoiceData.transactionId}`, {
          align: "right",
        })
        .text(`Booking Date: ${invoiceData.bookingDate}`, { align: "right" })
        .moveDown();

      // --- CUSTOMER INFO ---
      doc
        .fontSize(14)
        .fillColor("#000000")
        .text("Customer Information", { underline: true })
        .moveDown(0.2);

      doc.fontSize(12).text(`Name: ${invoiceData.userName}`).moveDown();

      // --- BOOKING DETAILS ---
      doc
        .fontSize(14)
        .text("Booking Details", { underline: true })
        .moveDown(0.2);

      doc.fontSize(12).text(`Tour: ${invoiceData.tourTitle}`);
      doc.text(`Guests: ${invoiceData.guestCount}`);
      doc
        .text(`Total Amount: $${invoiceData.totalAmount.toFixed(2)}`)
        .moveDown();

      // --- THANK YOU NOTE ---
      doc
        .moveDown()
        .fontSize(14)
        .fillColor("#333333")
        .text("Thank you for booking with us!", { align: "center" });

      // --- BORDER OR LINE ---
      doc
        .moveTo(50, doc.y + 15)
        .lineTo(545, doc.y + 15)
        .strokeColor("#aaaaaa")
        .stroke();

      // Finalize PDF
      doc.end();
    });
  } catch (error) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      `Failed to generate invoice ${error}`
    );
  }
};
