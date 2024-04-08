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
  const { username, password } = req.body;

  if (!username || !password) throw new BadRequestError("Please provide a username and password");

  const user = await User.findOne({ username });

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const token = user.createJWT(); // Remember the JWT token will be generated as the same token if the user's name matches, if they register as "bob" and the JWT is generated as "b1b", if "bob" logins in, when we create a new token with "bob" it will be generated as "b1b"
  res.status(StatusCodes.OK).json({ user: { username: user.username }, token });
};
