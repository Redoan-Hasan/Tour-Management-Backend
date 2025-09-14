import { Request, Response, NextFunction } from "express";
export type catchAsync = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface IMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}
export interface IResponse<DataType> {
  statusCode: number;
  success: boolean;
  message: string;
  data: DataType;
  meta?: Partial<IMeta>;
}

export interface ISetCookieTokenInfo {
  accessToken?: string;
  refreshToken?: string;
}


export interface ISendEmailOptions {
  to: string;
  subject: string;
  templateName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}