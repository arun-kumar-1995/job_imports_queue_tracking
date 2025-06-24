import { Errors } from "../constants/errors_type.constants.js";

export class APIError extends Error {
  constructor(http, message) {
    super(message);
    const { code, status } = http;
    this.statusCode = code;
    this.status = status;
    this.errorCode = Errors.CLIENT_ERROR;
  }
}
