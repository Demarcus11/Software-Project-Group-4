import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./CustomAPIError.js";

export class UnauthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
