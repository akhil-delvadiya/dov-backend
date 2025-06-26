// const app = require("./app");

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// server.js
const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");



dotenv.config();

const app = express();
app.use(cors());

// Middlewares
app.use(express.json());

// Routes
app.use("/", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});



