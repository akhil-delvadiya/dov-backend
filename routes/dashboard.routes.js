// const express = require("express");
// // routes/profile.routes.js
// const { ProfileStep } = require("../models/dashboard.model");

// // routes/company.routes.js
// const { CompanyStep } = require("../models/dashboard.model");

// const router = express.Router();
// const auth = require("../middleware/auth");

// // ✅ GET user's profile
// router.get("/profilestep", auth, async (req, res) => {
//   try {
//     const profile = await ProfileStep.findOne({ userId: req.userId });
//     if (!profile) {
//       return res.status(404).json({ message: "Profile not found" });
//     }
//     res.json(profile);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });
// // ✅ POST create profile
// router.post("/profilestep", auth, async (req, res) => {
//   try {
//     const existing = await ProfileStep.findOne({ userId: req.userId });
//     if (existing) {
//       return res.status(400).json({ message: "Profile already exists" });
//     }

//     const profile = new ProfileStep({
//       ...req.body,
//       userId: req.userId,
//     });

//     const saved = await profile.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     if (err.name === "ValidationError") {
//       const errorMessages = {};
//       for (let field in err.errors) {
//         errorMessages[field] = err.errors[field].message;
//       }
//       return res.status(400).json({ errors: errorMessages });
//     }

//     res.status(500).json({ message: "Something went wrong" });
//   }
// });

// // ✅ PUT update user profile
// router.put("/profilestep", auth, async (req, res) => {
//   try {
//     const updated = await ProfileStep.findOneAndUpdate(
//       { userId: req.userId },
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Profile not found" });
//     }

//     res.json(updated);
//   } catch (err) {
//     if (err.name === "ValidationError") {
//       const errorMessages = {};
//       for (let field in err.errors) {
//         errorMessages[field] = err.errors[field].message;
//       }
//       return res.status(400).json({ errors: errorMessages });
//     }

//     res.status(500).json({ message: "Update failed" });
//   }
// });

// router.get("/companystep",auth, async (req, res) => {
//   const companyprofiles = await CompanyStep.find({ userId: req.userId });
//   res.json(companyprofiles);
// });

// // POST create a profile Detials
// router.post("/companystep",auth, async (req, res) => {
//   try {
//     const companyprofile = new CompanyStep({
//       ...req.body,
//       userId: req.userId,
//     });
//     const saved = await companyprofile.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     if (err.name === "ValidationError") {
//       const errorMessages = {};

//       for (let field in err.errors) {
//         errorMessages[field] = err.errors[field].message;
//       }

//       return res.status(400).json({ errors: errorMessages });
//     }

//     res.status(500).json({ errorMessage: "Something went wrong" });
//   }
// });
// module.exports = router;

const express = require("express");
const router = express.Router();
const pool = require("../config/db"); // PostgreSQL connection
const auth = require("../middleware/auth");

// ✅ GET user's profile
router.get("/profilestep", auth, async (req, res) => {
  try {
    const profile = await pool.query(
      "SELECT * FROM profilestep WHERE user_id = $1",
      [req.userId]
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST create profile
router.post("/profilestep", auth, async (req, res) => {
  const {
    first_name,
    last_name,
    middle_name,
    employee_id,
    gender,
    date_of_birth,
    communication_address,
    personal_mail,
    permanent_address,
    company_mail,
    personal_contact_no,
    company_contact_no,
    emergency_contact_relation,
    emergency_contact_no,
    marital_status,
    blood_group,
    nationality,
    religion,
  } = req.body;

  try {
    const existing = await pool.query(
      "SELECT * FROM profilestep WHERE user_id = $1",
      [req.userId]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "... already exists" });
    }

    const insertQuery = `
      INSERT INTO profilestep (
        user_id, first_name, last_name, middle_name, employee_id, gender,
        date_of_birth, communication_address, personal_mail, permanent_address,
        company_mail, personal_contact_no, company_contact_no, emergency_contact_relation,
        emergency_contact_no, marital_status, blood_group, nationality, religion
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10,
        $11, $12, $13, $14,
        $15, $16, $17, $18, $19
      ) RETURNING *`;

    const values = [
      req.userId,
      first_name,
      last_name,
      middle_name,
      employee_id,
      gender,
      date_of_birth,
      communication_address,
      personal_mail,
      permanent_address,
      company_mail,
      personal_contact_no,
      company_contact_no,
      emergency_contact_relation,
      emergency_contact_no,
      marital_status,
      blood_group,
      nationality,
      religion,
    ];

    console.log("Inserting values:", values);

    const result = await pool.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Insert failed:", err.message);
    res.status(500).json({ message: err.message });
  }
});

router.get("/companystep", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM companystep WHERE user_id = $1",
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("GET /companystep error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ POST create company step
router.post("/companystep", auth, async (req, res) => {
  const {
    branch_name,
    department_name,
    date_of_joining,
    designation,
    bond_period,
    date_of_confimation,
    employee_status,
    reporting_manager,
    shift_type,
    employee_type,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO companystep (
        user_id, branch_name, department_name, date_of_joining,
        designation, bond_period, date_of_confimation,
        employee_status, reporting_manager, shift_type, employee_type
      ) VALUES (
        $1, $2, $3, $4,
        $5, $6, $7,
        $8, $9, $10, $11
      ) RETURNING *`,
      [
        req.userId,
        branch_name,
        department_name,
        date_of_joining,
        designation,
        bond_period,
        date_of_confimation,
        employee_status,
        reporting_manager,
        shift_type,
        employee_type,
      ]
    );

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ errorMessage: "Something went wrong" });
  }
});

module.exports = router;
