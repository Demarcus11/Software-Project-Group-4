import { model as User } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/BadRequestError.js";
import dotenv from "dotenv";
// Even though its not explicitly being used, you need this import for the catch block to run in async functions
import expressAsyncErrors from "express-async-errors";

dotenv.config();

// create user in DB, create token, send response back to frontend
export const register = async (req, res) => {
  const user = await User.create({ ...req.body }); // frontend will send req.body with username and password properties
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { username: user.username }, token }); // send username and token to frontend
};

export const login = async (req, res) => {
  res.send("Login User");
};
