const bCrypt = require("bcrypt");
const user = require("../model/userModal");
// ! get all users
exports.getAllUser = async (req, res) => {
  try {
    await user
      .find({})
      .then((doc) => res.send(doc))
      .catch((er) => {
        throw new Error(er);
      });
  } catch (error) {
    res.status(401).send(error);
  }
};
// ! create User
exports.createUser = async (req, res, next) => {
  try {
    const users = new user({
      ...req.body,
      password: await bCrypt.hash(req.body.password, 5),
    });
    await user.find({ email: req.body.email }).then(async (doc) => {
      if (!doc.length) {
        await users.save().then((ress) => res.status(200).send(ress));
      } else {
        next(new Error("Email is already in use"));
      }
      // res.send(doc.length);
    });
  } catch (error) {
    res.status(401).send(error);
  }
};
// !update user
exports.updateUser = async (req, res, next) => {
  try {
    await user
      .find({ _id: req.query.id })
      .then(async (doc) => {
        await user
          .updateOne({ _id: req.query.id }, { ...req.body })
          .then((docc) => res.status(200).send(...doc))
          .catch((err) => {
            return next(new Error("Unable to update user !!"));
          });
      })
      .catch((er) => {
        return next(new Error("id does'nt exists !!"));
      });
  } catch (error) {
    res.status(401).send(error);
  }
};
// ! get single user By Id
exports.getSingleUser = async (req, res, next) => {
  try {
    await user
      .findOne({ _id: req.query.id })
      .populate("myEvent")
      .populate("joinedEvent")
      .populate("wishList")
      .then((doc) => res.status(200).send(doc))
      .catch((er) => next(new Error("User does'nt exists !!")));
  } catch (error) {
    req.status(401).send(error);
  }
};
// ! delete a user
exports.deleteUser = async (req, res, next) => {
  try {
    await user
      .deleteOne({ _id: req.query.id })
      .then((doc) => res.status(200).send("User has been deleted !!"))
      .catch((er) => next(new Error("Unable to find user")));
  } catch (error) {
    res.status(404).send(error);
  }
};
