import { Errors } from "../constants/errors_type.constants.js";

export const APIError = (res, http, message) => {
  const { code, status } = http;
  return res.status(code).json({
    success: false,
    message,
    httpCode: code,
    status,
    errorCode: Errors.CLIENT_ERROR,
  });
};
