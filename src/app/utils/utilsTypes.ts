import { Request, Response, NextFunction } from "express";
export type catchAsync = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

interface IMeta{
    total:number;
}
export interface IResponse<DataType> {
    statusCode : number;
    success: boolean ;
    message: string;
    data: DataType;
    meta?: IMeta 
}

export interface ISetCookieTokenInfo{
  accessToken ?: string;
  refreshToken ?: string;
}