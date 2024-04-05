import { UnauthenticatedError } from "../errors/UnauthenticatedError.js";
import jwt from "jsonwebtoken";

// checker authrization header, get token, verify the token
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId, username: payload.username };
    next(); // pass to next middleware function
  } catch (error) {
    throw new UnauthenticatedError("Not authorized to access this route");
  }
};
