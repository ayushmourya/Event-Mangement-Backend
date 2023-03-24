var nodemailer = require("nodemailer");
const OTPModal = require("../model/otpModal");
const user = require("../model/userModal");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  secure: false,
  auth: {
    user: "donotreply@miratsinsights.com",
    pass: "ecqjxufncslctueo",
  },
});
const send = (mailOptions, cb) => {
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) cb(err);
    cb(null, info);
  });
};
// ! verify email
exports.verifyEmail = async (req, res, next) => {
  let { email, code } = req.query;
  try {
    await OTPModal.findOne({ email })
      .then(async (data) => {
        if (data.email == email && data.code == code) {
          await OTPModal.deleteOne({ email })
            .then((ress) => {
              res.status(200).send("Email Verified Successfully !!!");
            })
            .catch((er) => next(new Error("failed to delete otp !!!")));
        } else {
          next(new Error("Failure. Kindly check Email and code again !!!"));
        }
      })
      .catch((er) => res.send(er));
  } catch (error) {
    res.status(401).send(error);
  }
};
// !send create account otp
exports.sendEmail = (req, res, next) => {
  let x = Math.ceil(Math.random() * 19735);
  var mailOptions = {
    from: "varsha.jadhav@atomostech.com",
    to: req.query.email,
    subject: "Email Verification",
    html: "Your OTP for Email Verification is <b>" + x + "</b>",
  };
  try {
    send(mailOptions, async (err, data) => {
      if (err) {
        res.status(401).send(er);
      } else {
        let code = new OTPModal({ email: req.query.email, code: x });
        await code
          .save()
          .then((doc) => res.status(200).send("Email sent !!"))
          .catch((error) => {
            return res.status(401).send(error);
          });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
};
// ! resend otp of create account
exports.resendCreateAccountOTP = async (req, res, next) => {
  let { email } = req.query;
  try {
    const doc = await OTPModal.findOne({ email: email });
    console.log(doc);
    if (!doc) {
      console.log("otp is not present so sending it ");
      fetch(`/api/v1/event-management/otp/send-email?email=${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            res.status(200).send("OTP has been sent !!!");
          } else {
            throw new Error("Unable to send OTP !!!");
          }
        })
        .catch((error) => {
          next(error);
        });
    } else {
      console.log("OTP is present so removing it and then sending it again ");
      await OTPModal.deleteOne({ email })
        .then((ress) => {
          fetch(`/api/v1/event-management/otp/send-email?email=${email}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              if (response.ok) {
                res.status(200).send("OTP has been resent !!!");
              } else {
                throw new Error("Unable to resend OTP !!!");
              }
            })
            .catch((error) => {
              next(error);
            });
        })
        .catch((error) => next(new Error("Unable to delete previous otp !!")));
    }
  } catch (error) {
    // res.status(404).send();
    next(new Error("Directly in catch block from else scope"));
  }
};

// !send forgot password otp
exports.forgotPasswordEmail = async (req, res, next) => {
  let myOTP = Math.ceil(Math.random() * 19735);
  var resetMailOptions = {
    from: "varsha.jadhav@atomostech.com",
    to: req.query.email,
    subject: "Reset Password",
    html: "Reset Your Password Using this OTP <b>" + myOTP + "</b>",
  };
  try {
    let [exists] = await user.find({ email: req.query.email });
    if (exists) {
      send(resetMailOptions, async (err, daata) => {
        if (err) {
          return res.status(401).send(err);
        } else {
          let code = new OTPModal({ email: req.query.email, code: myOTP });
          await code
            .save()
            .then((doc) => res.send("Reset Password Email Sent !!"))
            .catch((error) => {
              return res.status(401).send(error);
            });
        }
      });
    } else {
      next(new Error("Email does not match with our database! "));
    }
  } catch (error) {
    res.status(401).send(error);
  }
};
// ! resend forgot password otp
exports.resendForgotPasswordEmail = async (req, res, next) => {
  let email = req.query.email;
  try {
    await user.findOne({ email }).then(async (doc) => {
      if (!doc) {
        next(new Error("Email does not match with our database!"));
      } else {
        await OTPModal.deleteOne({ email })
          .then((data) => {
            fetch(
              `/api/v1/event-management/forgot-password/send-email?email=${email}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            ).then((ress) => {
              res.status(200).send("Reset Password OTP sent !!!");
            });
          })
          .catch((er) => next(new Error("Unable to delete previous otp")));
      }
    });
  } catch (error) {}
};
