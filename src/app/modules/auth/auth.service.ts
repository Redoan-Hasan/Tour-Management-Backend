import bycrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { createUserToken, newAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/env";
const credentialsLoging = async (payload: Partial<IUser>) => {
  const isUserExist = await User.findOne({ email: payload.email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  const isPasswordMatched = await bycrypt.compare(
    payload.password as string,
    isUserExist.password as string
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password");
  }

  const tokens = createUserToken(isUserExist);

  const userWithOutPass = isUserExist.toObject();
  delete userWithOutPass.password;
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    user: userWithOutPass,
  };
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await newAccessTokenWithRefreshToken(refreshToken);
  return {
    accessToken : newAccessToken,
  }
};

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  const isOldPasswordMatched = await bycrypt.compare(oldPassword, user.password as string);
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  }
  user.password = await bycrypt.hash(newPassword,envVars.BYCRYPT_SALT_ROUNDS);
  await user.save();
  return;
};

export const AuthServices = {
  credentialsLoging,
  getNewAccessToken,
  resetPassword,
};
