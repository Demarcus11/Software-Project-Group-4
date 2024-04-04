import { StatusCodes } from "http-status-codes";

export const errorHandlerMiddleware = (err, req, res, next) => {
  // custom error defaults
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(",");
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  // check if the the error is a mongoose error (DB error) and if the error code is a duplicate value error
  if (err.code && err.code === 11000) {
    customError.msg = `That ${Object.keys(err.keyValue)} is taken. Try another.`; // since keyValue is an Object you'll get [Object, object], so we can use Object.keys() to get the values instead the obj
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }
  // return res.status(customError.statusCode).json(err); // keeping just to reference what the error objects mongoose sends look like
  return res.status(customError.statusCode).json({ msg: customError.msg });
};
