import express from "express";
import helmet from "helmet";
import cors from "cors";
import xss from "xss-clean";
import rateLimit from "express-rate-limit";
import path from "path";
import * as url from "url";
import { notFoundMiddleware } from "./middleware/NotFound.js";
import { errorHandlerMiddleware } from "./middleware/ErrorHandler.js";
import { router as authRouter } from "./routes/auth.js";
import { router as dashboardRouter } from "./routes/dashboard.js";
import { connectDB } from "./db/Connect.js";
import { auth as authenticateUser } from "./middleware/Authentication.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Initialize server
const server = express();

server.set("trust proxy", 1);
server.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);

// Body parser middleware, so the server can process the json the user enters when a POST request
server.use(express.json());

// Secruity middleware
server.use(helmet());
server.use(cors());
server.use(xss());

// Route that checks if sevrer is running
server.get("/projects-api", (req, res) => {
  res.status(200).send("projects api");
});

// Initialize static folder
server.use(express.static(path.join(__dirname, "public")));

// Root routes
server.use("/api/v1/auth", authRouter);
server.use("/api/v1/dashboard", authenticateUser, dashboardRouter);

server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

// Start server
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    server.listen(PORT);
  } catch (error) {
    console.log(error);
  }
};

start();
