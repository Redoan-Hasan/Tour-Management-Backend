import httpStatus from "http-status-codes";
import nodemailer from "nodemailer";
import envVars from "../config/env";
import { ISendEmailOptions } from "./utilsTypes";
import path from "path";
import ejs from "ejs";
import AppError from "../errorHelpers/appError";
const transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: envVars.EMAIL_SENDER.SMTP_PORT,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS,
  },
});

export const sendEmail = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: ISendEmailOptions) => {
  try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`);
    const templateHtml = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to: to,
      subject: subject,
      html: templateHtml,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });
    console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    return info;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to send email",
      error.message
    );
  }
};
