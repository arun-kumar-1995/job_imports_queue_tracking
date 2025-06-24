import { Errors } from "../constants/errors_type.constants.js";

export const ErrorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server error";
  let errorCode = Errors.SERVER_ERROR;

  if (err instanceof ReferenceError) {
    errorCode = Errors.REFERANCE_ERROR;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    httpCode: statusCode,
    errorCode,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
