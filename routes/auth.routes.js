const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const { signup, login } = require("../controllers/auth.controller");

// Signup
// router.post(
//   "/signup",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
//   ],
//   signup
// );

// // Login
// router.post(
//   "/login",
//   [
//     body("email").isEmail().withMessage("Valid email required"),
//     body("password").notEmpty().withMessage("Password required"),
//   ],
//   login
// );


router.post("/signup", (req, res) => {
  res.json({ message: "Signup mock route working ✅" });
});

router.post("/login", (req, res) => {
  res.json({ message: "Login mock route working ✅" });
});


module.exports = router;