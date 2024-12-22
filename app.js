const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const clothingItemsRoutes = require("./routes/clothingItems");

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

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("Hello, Hot Reload!");
});

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("connected to DB"))
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);
app.use("/items", clothingItemsRoutes); // Register clothing items routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
