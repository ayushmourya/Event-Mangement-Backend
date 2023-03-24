const mongoose = require("mongoose");
let eventSchema = new mongoose.Schema(
  {
    eventCoverPhotos: [
      {
        type: String,
      },
    ],
    title: {
      type: String,
    },
    description: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      default: null,
    },
    date: {
      type: Date,
      default: null,
    },
    time: {
      type: String,
      default: null,
    },
    duration: {
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
    address: {
      type: String,
      default: null,
    },
    price: {
      type: String,
      default: null,
    },
    FAQ: {
      type: Array,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    attendance: {
      type: Number,
      default: 0,
    },
    currentAttendance: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
let eventModel = new mongoose.model("events", eventSchema);
module.exports = eventModel;
