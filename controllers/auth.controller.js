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
const pool = require("../config/db");

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
// exports.login = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   const { email, password } = req.body;

//   try {
//     const result = await connection.query(
//       "SELECT * FROM users WHERE email = $1",
//       [email]
//     );
//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Bad credentials" });
//     }

//     const payload = {
//       userId: user.id,
//       email: user.email,
//       password: user.password,
//     };
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     //  res.cookie("token", token, {
//     //   httpOnly: true,
//     //   secure: process.env.NODE_ENV === "production",
//     //   maxAge: 5 * 60 * 60 * 1000,
//     //   sameSite: "strict",
//     // });

//     res.status(200).json({ message: "Login successful!", token });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.login = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password, deviceId, clientIP } = req.body;
//   const allowedIP = "27.57.5.81";

//   const forwardedFor = req.headers["x-forwarded-for"];
//   const remoteAddress = req.socket?.remoteAddress;

//   const ip = forwardedFor
//     ? forwardedFor.split(",")[0].trim()
//     : remoteAddress?.replace("::ffff:", "") || "";

//   console.log("Client IP:", ip);

//   // if (process.env.NODE_ENV === "development" && ip === "::1") {
//   //   console.log("Development mode - allowing localhost");
//   // } else if (ip !== allowedIP) {
//   //   return res.status(403).json({ message: "Unauthorized network" });
//   // }

//   try {
//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [
//       email,
//     ]);
//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     // ✅ Check active session
//     const session = await pool.query(
//       "SELECT * FROM active_sessions WHERE user_id = $1",
//       [user.id]
//     );
//     const existing = session.rows[0];

//     if (existing && existing.device_id !== deviceId) {
//       // ❌ Old session found from different device — logout that session
//       await pool.query("DELETE FROM active_sessions WHERE user_id = $1", [
//         user.id,
//       ]);
//     }

//     // ✅ Save new session
//     await pool.query(
//       `INSERT INTO active_sessions (user_id, device_id, ip_address)
//        VALUES ($1, $2, $3)
//        ON CONFLICT (user_id) DO UPDATE
//        SET device_id = $2, ip_address = $3, last_active = CURRENT_TIMESTAMP`,
//       [user.id, deviceId, ip]
//     );

//     // ✅ Generate JWT token
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     return res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// exports.login = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password, deviceId, clientIP } = req.body;
//   const allowedIP = "27.57.5.81";

//   // ✅ IP check from frontend only
//   if (process.env.NODE_ENV !== "development" && clientIP !== allowedIP) {
//     return res.status(403).json({ message: "Unauthorized network" });
//   }

//   try {
//     // ✅ Step 1: Get user by email
//     const result = await pool.query("SELECT * FROM users WHERE email = $1", [
//       email,
//     ]);
//     const user = result.rows[0];

//     if (!user) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // ✅ Step 2: Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Incorrect password" });
//     }

//     // ✅ Step 3: Check existing session
//     let existingSession;
//     try {
//       const session = await pool.query(
//         "SELECT * FROM active_sessions WHERE user_id = $1",
//         [user.id]
//       );
//       existingSession = session.rows[0];
//     } catch (err) {
//       console.error("Session check failed:", err);
//       // continue anyway, don’t block login
//     }

//     if (existingSession && existingSession.device_id !== deviceId) {
//       await pool.query("DELETE FROM active_sessions WHERE user_id = $1", [
//         user.id,
//       ]);
//     }

//     // ✅ Step 4: Save/Update session
//     try {
//       await pool.query(
//         `INSERT INTO active_sessions (user_id, device_id, ip_address)
//          VALUES ($1, $2, $3)
//          ON CONFLICT (user_id) DO UPDATE
//          SET device_id = $2, ip_address = $3, last_active = CURRENT_TIMESTAMP`,
//         [user.id, deviceId, clientIP]
//       );
//     } catch (err) {
//       console.error("Session insert/update failed:", err);
//       return res.status(500).json({ message: "Session error" });
//     }

//     // ✅ Step 5: Generate JWT
//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     return res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     console.error("Login error:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password, deviceId, clientIP } = req.body;

  const allowedIP = "27.57.5.81"; // Your static IP here
  console.log("Client IP:", clientIP, "Allowed IP:", allowedIP);
  console.log("clientIP === allowedIP", clientIP === allowedIP);
  if (clientIP === allowedIP) {
    try {
      // ✅ Step 1: Get user by email
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      const user = result.rows[0];

      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // ✅ Step 2: Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
      }

      // ✅ Step 3: Check existing session
      let existingSession;
      try {
        const session = await pool.query(
          "SELECT * FROM active_sessions WHERE user_id = $1",
          [user.id]
        );
        existingSession = session.rows[0];
      } catch (err) {
        console.error("Session check failed:", err);
      }

      if (existingSession && existingSession.device_id !== deviceId) {
        await pool.query("DELETE FROM active_sessions WHERE user_id = $1", [
          user.id,
        ]);
      }

      // ✅ Step 4: Save/Update session
      try {
        await pool.query(
          `INSERT INTO active_sessions (user_id, device_id, ip_address)
         VALUES ($1, $2, $3)
         ON CONFLICT (user_id) DO UPDATE
         SET device_id = $2, ip_address = $3, last_active = CURRENT_TIMESTAMP`,
          [user.id, deviceId, clientIP]
        );
      } catch (err) {
        console.error("Session insert/update failed:", err);
        return res.status(500).json({ message: "Session error" });
      }

      // ✅ Step 5: Generate JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
