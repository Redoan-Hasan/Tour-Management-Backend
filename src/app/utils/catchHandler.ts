import { Request, Response, NextFunction } from "express";
import { catchAsync } from "./utilsTypes";

// export const catchHandler =
//   (func: catchAsync) =>
//   (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(func(req, res, next)).catch((error) => {
//       next(error);
//     });
//   };

export const catchHandler = (func : catchAsync) => async(req : Request,res :Response,next :NextFunction)=>{
    try {
      await func(req,res,next);
    } catch (error) {
      next(error)
    }
}