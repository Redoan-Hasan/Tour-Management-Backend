/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { TErrorSources, TGlobalErrorResponse } from "../Interfaces/error.types";

export const handleValidationError = (error: mongoose.Error.ValidationError) : TGlobalErrorResponse =>{
    const errorSources: TErrorSources[] = [];
    const statusCode = 400;
    const errors = Object.values(error.errors);
    errors.forEach((errorObject: any) =>
      errorSources.push({
        path: errorObject.path,
        message: errorObject.message,
      })
    );
    return {
      statusCode,
      message: "Validation error",
      errorSources,
    };
}