// const User = require("../models/login.model");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.signup = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user
//     const user = new User({ email, password: hashedPassword });
//     await user.save();

//     res.status(201).json({ message: "User created successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     console.log("Login attempt:", email);

//     const user = await User.findOne({ email });
//     if (!user) {
//       console.log("User not found");
//       return res.status(401).json({ message: "Bad credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Password mismatch");
//       return res.status(401).json({ message: "Bad credentials" });
//     }

//     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(200).json({ token });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// const User = require("../models/user.model");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");

// exports.signup = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ where: { email } });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({ email, password: hashedPassword });

//     res.status(201).json({ message: "User created successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(401).json({ message: "Bad credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Bad credentials" });

//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(200).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

const connection = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { sendSignupEmail } = require("../utils/mailer");

// SIGNUP
exports.signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    // Check if user already exists
    const existing = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await connection.query(
      "INSERT INTO users (email, password) VALUES ($1, $2)",
      [email, hashedPassword]
    );
    
    // Send confirmation email
    await sendSignupEmail(
      email,  
      "Welcome to Our App 🎉",
      `Hi Email: ${email} ${password},\n\nThanks for signing up! We're glad to have you.`
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;

  try {
    const result = await connection.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Bad credentials" });
    }

    const payload = {
      userId: user.id,
      email: user.email,
      password: user.password,
    };
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    //  res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 5 * 60 * 60 * 1000,
    //   sameSite: "strict",
    // });

    res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
