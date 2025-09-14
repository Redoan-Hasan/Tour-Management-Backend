import { NextFunction, Request, Response } from "express";
import { catchHandler } from "../../utils/catchHandler";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/appError";
import { setCookie } from "../../utils/setCookie";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utils/userTokens";
import envVars from "../../config/env";
import passport from "passport";

const credentialsLogin = catchHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    passport.authenticate("local", async (error: any, user: any, info: any) => {
      if (error) {
        // return next(error);
        return next(new AppError(
          httpStatus.NOT_FOUND,
          error
        )); 
      }
      if (!user) {
        return next(new AppError(
          httpStatus.NOT_FOUND,
          info?.message || "Not Found"
        )); 
      }

      const userTokens = await createUserToken(user);
      setCookie(res, userTokens);
      const userWithOutPass = user.toObject();
      delete userWithOutPass.password;
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User logged in successfully",
        data: {
          accessToken: userTokens.accessToken,
          refreshToken: userTokens.refreshToken,
          user: userWithOutPass,
        },
      });
    })(req, res, next);

    // const loginInfo = await AuthServices.credentialsLoging(req.body);

    // res.cookie('accessToken', loginInfo.accessToken,{
    //   httpOnly:true,
    //   secure: false,
    // });
    // res.cookie('refreshToken', loginInfo.refreshToken,{
    //   httpOnly:true,
    //   secure: false,
    // })

    // setCookie(res, loginInfo);
    // sendResponse(res, {
    //   statusCode: httpStatus.OK,
    //   success: true,
    //   message: "User logged in successfully",
    //   data: loginInfo,
    // });
  }
);

const getNewAccessToken = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Refresh Token is required");
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);
    // setCookie(res, tokenInfo)
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "New Access Token generated Successfully",
      data: tokenInfo,
    });
  }
);

const logout = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  }
);

const resetPassword = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    await AuthServices.resetPassword(req.body, decodedToken);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Reseted Successfully",
      data: null,
    });
  }
);
const setPassword = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const {password} = req.body;
    await AuthServices.setPassword(decodedToken.id, password);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Set Successfully",
      data: null,
    });
  }
);
const forgetPassword = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const {email} = req.body;
    await AuthServices.forgetPassword(email);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Email sent successfully",
      data: null,
    });
  }
);
const changePassword = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;
    await AuthServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

const googleCallBackController = catchHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = (req.query.state as string) || "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    const user = req.user;
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
    }
    const tokenInfo = createUserToken(user);
    setCookie(res, tokenInfo);
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);

export const AuthController = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  setPassword,
  changePassword,
  forgetPassword,
  googleCallBackController,
};
