const express = require("express");
const User = require("../models/user.model");

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});
  
// POST create a user
router.post("/", async (req, res) => {
  const newUser = new User(req.body);
  const savedUser = await newUser.save();
  res.json(savedUser);
});

module.exports = router;