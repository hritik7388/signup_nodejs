const mongoose = require("mongoose");
const testSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    otpVerification: {
      type: Boolean,
      default: false,
    },
    number: {
      type: Number,
      require: true,
    },
    state: {
      type: String,
      default: "",
    },
    countryName: {
      type: String,
    },
    otp: {
      type: String,
    },
    otpExpiration: {
      type: Number,
    },
    Usertype: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "BLOCK", "DELETE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);
const test = mongoose.model("test", testSchema, "tests");
module.exports = test;
