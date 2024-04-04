import express from "express";
import path from "path";
import * as url from "url";
import { notFoundMiddleware } from "./middleware/NotFound.js";
import { errorHandlerMiddleware } from "./middleware/ErrorHandler.js";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// Initialize server
const server = express();

// Body parser middleware, so the server can process the json the user enters when a POST request
server.use(express.json());

// Initialize static folder
server.use(express.static(path.join(__dirname, "public")));

// Root routes
server.use("/api/v1/auth");
server.use("/api/v1/dashboard");

server.use(notFoundMiddleware);
server.use(errorHandlerMiddleware);

// Start server
const PORT = process.env.PORT || 5000;

const start = () => {
  server.listen(PORT, () => {
    console.log(`Server running on: http://localhost:${PORT}/`);
  });
};

start();
