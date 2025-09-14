import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchHandler } from "../../utils/catchHandler";
import { sendResponse } from "../../utils/sendResponse";
import { verifyToken } from "../../utils/jwt";
import envVars from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "User created successfully",
      data: user,
    });
  }
);

const getAllUsers = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const allUser = await UserServices.getAllUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All users fetched successfully",
      data: allUser.data,
      meta: allUser.meta,
    });
  }
);
const getMe = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const getMe = await UserServices.getMe(decodedToken.id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Your profile fetched successfully",
      data: getMe,
    });
  }
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const updateUser = catchHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const payload = req.body;
    const token = req.headers.authorization;
    const verifiedToken = verifyToken(
      token as string,
      envVars.JWT_ACCESS_TOKEN_SECRET
    ) as JwtPayload;
    const updatedUser = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User Updated Successfully",
      data: updatedUser,
    });
  }
);

export const UserController = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
};
