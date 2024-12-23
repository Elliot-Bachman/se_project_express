const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

// Set the port from the environment variable or default to 3001
const { PORT = 3001 } = process.env;
const app = express();

// Middleware to simulate a logged-in user
app.use((req, res, next) => {
  req.user = {
    _id: "676725a5a4d8109f0087ab58", // Replace with a valid user ID from your database
  };
  next();
});

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

app.use(express.json());
app.use("/", mainRouter);

// Start the server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.info(`Server is running on http://localhost:${PORT}`);
  }
});
