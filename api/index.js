// // api/index.js
// const serverless = require("serverless-http");
// const express = require("express");
// const app = express();
// const authRoutes = require("../routes/auth.routes");

// app.use(express.json());
// app.use("/api", authRoutes); // your /signup and /login are now /api/signup, /api/login

// module.exports.handler = serverless(app);


// api/index.js
const serverless = require("serverless-http");
const express = require("express");
const app = express();

// TEST ROUTE to see if app loads
app.get("/ping", (req, res) => res.json({ status: "ok ✅" }));

// Load real routes
const authRoutes = require("../routes/auth.routes"); // may crash if file missing

app.use(express.json());
app.use("/api", authRoutes);

module.exports.handler = serverless(app);