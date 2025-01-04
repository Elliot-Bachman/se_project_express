const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import cors
const mainRouter = require("./routes/index");

// Set the port from the environment variable or default to 3001
const { PORT = 3001 } = process.env;
const app = express();

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

// Connect the main router
app.use("/", mainRouter);

// Start the server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.info(`Server is running on http://localhost:${PORT}`);
  }
});
