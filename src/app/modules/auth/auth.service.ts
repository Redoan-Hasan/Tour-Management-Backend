import bycrypt from "bcryptjs";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IsActive, IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import {
  createUserToken,
  newAccessTokenWithRefreshToken,
} from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import envVars from "../../config/env";
import { generateJWTToken } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendEmail";
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
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  oldPassword: string,
  newPassword: string,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  const isOldPasswordMatched = await bycrypt.compare(
    oldPassword,
    user.password as string
  );
  if (!isOldPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Old password is incorrect");
  }
  user.password = await bycrypt.hash(newPassword, envVars.BYCRYPT_SALT_ROUNDS);
  await user.save();
  return;
};
const setPassword = async (userId: string, plainPassword: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  if (user.password && user.auths.some((auth) => auth.provider === "google")) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password is already set for this user"
    );
  }
  const hashedPassword = await bycrypt.hash(
    plainPassword,
    envVars.BYCRYPT_SALT_ROUNDS
  );
  const credentialProvider: IAuthProvider = {
    provider: "credentials",
    providerId: user.email,
  };
  const auths = [...user.auths, credentialProvider];
  user.password = hashedPassword;
  user.auths = auths;
  await user.save();
};


const resetPassword = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload : Record<string, any>,
  decodedToken: JwtPayload
) => {
  const {id, newPassword} = payload;
  if(id !== decodedToken.id){
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized request");
  }
  const isUserExist = await User.findById(decodedToken.id);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }
  isUserExist.password = await bycrypt.hash(newPassword, envVars.BYCRYPT_SALT_ROUNDS);
  await isUserExist.save();
  return;
};
const forgetPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });
  if (!isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(httpStatus.BAD_REQUEST, "User is not verified");
  }
  if (
    isUserExist.isActive === IsActive.BLOCKED ||
    isUserExist.isActive === IsActive.INACTIVE
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `User is ${isUserExist.isActive}`
    );
  }
  if (isUserExist.isDeleted) {
    throw new AppError(httpStatus.BAD_REQUEST, "User has been deleted");
  }
  const jwtPayload = {
    id: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };
  const resetToken = generateJWTToken(
    jwtPayload,
    envVars.JWT_ACCESS_TOKEN_SECRET,
    "10m"
  );
  const resetUILink = `${envVars.FRONTEND_URL}/reset-password?user_id=${isUserExist._id}&token=${resetToken}`;
  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset Request",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink
    },
  });
  return;
};

export const AuthServices = {
  credentialsLoging,
  getNewAccessToken,
  resetPassword,
  setPassword,
  changePassword,
  forgetPassword,
};
