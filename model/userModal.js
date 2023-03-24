const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  profilePhoto: {
    type: String,
    default: null,
  },
  dob: {
    type: String,
    default: null,
  },
  country: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  myEvent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
    },
  ],
  wishList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
    },
  ],
  joinedEvent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "events",
    },
  ],
  about: {
    type: String,
    default: null,
  },
});

const user = new mongoose.model("users", userSchema);
module.exports = user;
