// api/index.js
const serverless = require("serverless-http");
const express = require("express");
const app = express();
const authRoutes = require("../routes/auth.routes");

app.use(express.json());
app.use("/api", authRoutes); // your /signup and /login are now /api/signup, /api/login

module.exports = app