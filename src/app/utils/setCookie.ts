import { Response } from "express";
import { ISetCookieTokenInfo } from "./utilsTypes";

export const setCookie = (res: Response, tokenInfo: ISetCookieTokenInfo) => {
  if (tokenInfo.accessToken) {
    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });
  }
  if (tokenInfo.refreshToken) {
    res.cookie("refreshToken", tokenInfo.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};
