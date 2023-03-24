require("dotenv").config();
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://Altaf:EventManagement@eventmanagement.0ychxyh.mongodb.net/eventmanagement"
  )
  .then((res) => console.log("MongoDB Connected"))
  .catch((er) => console.log("Error in mongoDB Connection"));
