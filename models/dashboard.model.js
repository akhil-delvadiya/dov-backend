const mongoose = require("mongoose");

const profileStepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: { type: String, required: [true, "first Name is required"] },
  lastName: { type: String, required: [true, "last Name is required"] },
  middleName: { type: String },
  employeeId: {
    type: String,
    required: [true, "employee Id is required"],
  },
  gender: { type: String },
  dateOfBirth: { type: Date, required: [true, "date Of Birth is required"] },
  communicationAddress: {
    type: String,
    required: [true, "communication Address is required"],
  },
  personalMail: { type: String },
  permanentAddress: {
    type: String,
    required: [true, "permanent Address is required"],
  },
  companyMail: { type: String },
  personalContactNo: {
    type: String,
    required: [true, "personal Contact No is required"],
  },
  companyContactNo: {
    type: String,
    required: [true, "company Contact No is required"],
  },
  emergencyContactRelation: {
    type: String,
    required: [true, "emergency Contact Relation is required"],
  },
  emergencyContactNo: { type: String },
  maritalStatus: { type: String },
  bloodGroup: { type: String },
  nationality: { type: String },
  religion: { type: String },
});

const companyStepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  branchName: { type: String, required: [true, "Branch Name is required"] },
  departmentName: {
    type: String,
    required: [true, "Department Name is required"],
  },
  dateOfJoining: {
    type: Date,
    required: [true, "date Of Joining is required"],
  },
  designation: {
    type: String,
    required: [true, "Designation is required"],
  },
  bondPeriod: { type: String },
  dateOfConfimation: {
    type: String,
    required: [true, "date Of Confirmation is required"],
  },
  employeeStatus: { type: String },
  reportingManager: { type: String },
  shiftType: { type: String },
  employeeType: { type: String },
});

const ProfileStep = mongoose.model("ProfileStep", profileStepSchema);
const CompanyStep = mongoose.model("CompanyStep", companyStepSchema);
module.exports = { ProfileStep, CompanyStep };