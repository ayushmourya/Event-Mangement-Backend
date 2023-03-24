const mongoose = require("mongoose");
const OTPSchema = new mongoose.Schema(
  {
    email: { type: String },
    code: { type: Number },
  },
  { timestamps: true }
);
const OTPModal = new mongoose.model("otp", OTPSchema);
module.exports = OTPModal;
