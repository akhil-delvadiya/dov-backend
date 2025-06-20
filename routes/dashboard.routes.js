const express = require("express");
// routes/profile.routes.js
const { ProfileStep } = require("../models/dashboard.model");

// routes/company.routes.js
const { CompanyStep } = require("../models/dashboard.model");

const router = express.Router();
const auth = require("../middleware/auth");

// ✅ GET user's profile
router.get("/profilestep", auth, async (req, res) => {
  try {
    const profile = await ProfileStep.findOne({ userId: req.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ POST create profile
router.post("/profilestep", auth, async (req, res) => {
  try {
    const existing = await ProfileStep.findOne({ userId: req.userId });
    if (existing) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new ProfileStep({
      ...req.body,
      userId: req.userId,
    });

    const saved = await profile.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = {};
      for (let field in err.errors) {
        errorMessages[field] = err.errors[field].message;
      }
      return res.status(400).json({ errors: errorMessages });
    }

    res.status(500).json({ message: "Something went wrong" });
  }
});


// ✅ PUT update user profile
router.put("/profilestep", auth, async (req, res) => {
  try {
    const updated = await ProfileStep.findOneAndUpdate(
      { userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(updated);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = {};
      for (let field in err.errors) {
        errorMessages[field] = err.errors[field].message;
      }
      return res.status(400).json({ errors: errorMessages });
    }

    res.status(500).json({ message: "Update failed" });
  }
});




router.get("/companystep",auth, async (req, res) => {
  const companyprofiles = await CompanyStep.find({ userId: req.userId });
  res.json(companyprofiles);
});

// POST create a profile Detials
router.post("/companystep",auth, async (req, res) => {
  try {
    const companyprofile = new CompanyStep({
      ...req.body,
      userId: req.userId,
    });
    const saved = await companyprofile.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err.name === "ValidationError") {
      const errorMessages = {};

      for (let field in err.errors) {
        errorMessages[field] = err.errors[field].message;
      }

      return res.status(400).json({ errors: errorMessages });
    }

    res.status(500).json({ errorMessage: "Something went wrong" });
  }
});
module.exports = router;
