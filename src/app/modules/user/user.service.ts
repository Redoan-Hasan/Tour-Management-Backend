import AppError from "../../errorHelpers/appError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bycrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {
  // const { name, email } = payload;
  const isUserExist = await User.findOne({ email: payload.email });
  if (isUserExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "User already exist");
  }
  if(payload?.password){
  const hashPassword = await bycrypt.hash(payload.password as string,10);
  payload.password = hashPassword;
  }
  const authProvider:IAuthProvider = {
    provider: "credentials",
    providerId: payload.email as string,
  }
  const user = await User.create({...payload, auths:[authProvider]});
  return user;
};

const getAllUsers = async () => {
  const allUser = await User.find();
  const allUserCount = await User.countDocuments();
  return {
    data: allUser,
    meta: { total: allUserCount },
  };
};


const getMe = async (id:string) => {
  const getMe = await User.findById(id).select("-password");
  return {
    data: getMe,
  };
};
const getSingleUser = async (id:string) => {
  const singleUserInfo = await User.findById(id).select("-password");
  return {
    data: singleUserInfo,
  };
};


const updateUser = async(userId : string, payload: Partial<IUser>, decodedToken:JwtPayload) => {
  if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
    if(decodedToken.id !== userId){
      throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
    }
  }
  const isUserExist = await User.findById(userId);
  if(!isUserExist){
    throw new AppError(httpStatus.NOT_FOUND , "User does not exist");
  }
  if(decodedToken.role === Role.ADMIN && isUserExist.role === Role.SUPER_ADMIN){
    throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
  }
  if(payload.role){
    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
      throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
    }
    // if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
    //   throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
    // }
  }
  if(payload.isActive || payload.isDeleted || payload.isVerified){
    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
      throw new AppError(httpStatus.FORBIDDEN,"You are not authorized")
    }
  }
    const newUpdateUser = await User.findByIdAndUpdate(userId, payload,{new:true, runValidators:true});
    return newUpdateUser;
}
export const UserServices = {
  createUser,
  getAllUsers,
  updateUser,
  getMe,
  getSingleUser
};
