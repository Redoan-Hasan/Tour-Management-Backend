import { Response } from "express";
import { ISetCookieTokenInfo } from "./utilsTypes";
import envVars from "../config/env";

export const setCookie = (res: Response, tokenInfo: ISetCookieTokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};
