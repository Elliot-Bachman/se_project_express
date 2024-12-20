// Import express
const express = require("express");

// Import mongoose
const mongoose = require("mongoose");

// Create an instance of an Express app
const app = express();

// import routes

const mainRouter = require("./routes/index");

// Set the port from the environment variable or default to 3001
const { PORT = 3001 } = process.env;

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("Hello, Hot Reload!");
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to DB");
  })
  .catch(console.error);

app.use("/", mainRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
