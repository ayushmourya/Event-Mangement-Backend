const user = require("../model/userModal");
const bCrypt = require("bcrypt");
exports.loginUser = async (req, res, next) => {
  try {
    await user
      .findOne({ email: req.body.email })
      .then(async (doc) => {
        if (!doc) {
          next(new Error("Invalid Email !!!"));
        } else {
          let match = await bCrypt.compare(req.body.password, doc.password);
          if (!match) {
            next(new Error("Invalid Password"));
          } else {
            res.send(doc);
          }
        }
      })
      .catch((er) => res.send(er));
  } catch (error) {
    res.status(401).send(error);
  }
};
