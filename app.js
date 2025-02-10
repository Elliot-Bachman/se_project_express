const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const routes = require("./routes");
const errorHandler = require("./middlewares/error-handler");
require("dotenv").config();

// Set the port from the environment variable or default to 3001
const { PORT = 3001 } = process.env;
const app = express();

// Enable Mongoose debugging
mongoose.set("debug", true); // Logs all Mongoose queries to the console

// Enable CORS
app.use(cors());

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      console.info("Connected to DB");
    }
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

// Middleware to parse JSON
app.use(express.json());

// request logger
app.use(requestLogger);
app.use(routes);

// use Request Logger
app.use(errorLogger);
app.use(errors()); // Celebrate validation errors
app.use(errorHandler); // Centralized error handling

// Connect the main router
app.use("/", mainRouter);

// Routes
app.use(routes);

// Celebrate validation error handler
app.use(errors());

// Centralized error handler
app.use(errorHandler);

// Crash-test route
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Start the server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.info(`Server is running on http://localhost:${PORT}`);
  }
});
