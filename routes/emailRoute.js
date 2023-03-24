const express = require("express");
const router = express.Router();
const emailController = require("../controller/emailController");
router.post("/otp/send-email", emailController.sendEmail);
router.post("/otp/resend/send-email", emailController.resendCreateAccountOTP);
router.post("/forgot-password/send-email", emailController.forgotPasswordEmail);
router.post(
  "/resend/forgot-password/send-email",
  emailController.resendForgotPasswordEmail
);
router.post("/verify-email", emailController.verifyEmail);
module.exports = router;
