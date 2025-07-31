import mongoose from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleCastError = (error: mongoose.Error.CastError) => {
  return {
    statusCode: 400,
    message: "Invalid Mongoose ObjectId",
  };
};
