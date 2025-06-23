const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { signup, login } = require("../controllers/auth.controller");

// Signup
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
  ],
  signup
);

// Login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  login
);

module.exports = router;