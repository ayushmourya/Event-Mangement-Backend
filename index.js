require("dotenv").config();
require("./db/connect");
const express = require("express");
const app = express();
const PORT = 9999;
const cors = require("cors");
const path = "/api/v1/event-management";
const user = require("./routes/userRoute");
const email = require("./routes/emailRoute");
const login = require("./routes/loginRoute");
const event = require("./routes/eventRoute");
app.use(cors());
app.use(express.json());
app.use(path, user);
app.use(path, email);
app.use(path, login);
app.use(path, event);
app.use((err, req, res, next) => {
  res.status(401).send({ success: false, message: err.message });
});
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
