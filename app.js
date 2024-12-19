// Import express
const express = require("express");

// Create an instance of an Express app
const app = express();

// Set the port from the environment variable or default to 3001
const { PORT = 3001 } = process.env;

// Define a simple route for testing
app.get("/", (req, res) => {
  res.send("Hello, Hot Reload!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
