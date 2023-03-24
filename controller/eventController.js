const event = require("../model/eventModel");
const user = require("../model/userModal");
// ! get all events
exports.getAllEvents = async (req, res, next) => {
  try {
    let result = await event.find({});
    res.status(200).send(result);
  } catch (error) {
    next(new Error(error.message));
  }
};
// ! get single event by event id and populate organizer details
exports.getSingleEvent = async (req, res, next) => {
  let { _id } = req.query;
  try {
    await event
      .findOne({ _id })
      .populate("organizer")
      .then((doc) => {
        if (!doc) {
          next(new Error("Invalid id !!!"));
        } else {
          res.status(200).send(doc);
        }
      });
  } catch (error) {
    next(new Error(error.message));
  }
};
// ! Create event
exports.createEvent = async (req, res, next) => {
  try {
    let eventData = new event({ ...req.body });
    await eventData
      .save()
      .then(async (doc) => {
        res.status(200).send(doc);
        await user.updateOne(
          { _id: doc.organizer },
          { $push: { myEvent: doc._id } }
        );
      })
      .catch((error) => {
        next(new Error(error.message));
      });
  } catch (error) {
    next(new Error(error.message));
  }
};

// ! update event
exports.updateEvent = async (req, res, next) => {
  let { _id } = req.query;
  try {
    await event
      .findOne({ _id })
      .then(async (doc) => {
        await event
          .updateOne({ _id }, { ...req.body })
          .then((result) => res.send("Event Updated successful"))
          .catch((er) => next(new Error(er.message)));
      })
      .catch((er) => next(new Error("Invalid event id")));
  } catch (error) {
    next(new Error(error.message));
  }
};
// ! delete event
exports.deleteEvent = async (req, res, next) => {
  let { _id, uid } = req.query;
  try {
    await event
      .deleteOne({ _id, organizer: uid })
      .then((doc) => res.status(200).send("Event Deleted Successfully !!!"))
      .catch((er) => {
        if (er.value == _id) {
          next(new Error("Invalid event id !!!"));
        } else if (er.value == uid) {
          next(new Error("Invalid user id !!!"));
        } else {
          next(new Error("Invalid event and user id"));
        }
      });
  } catch (error) {
    next(new Error(error.message));
  }
};
// ! join event
exports.joinEvent = async (req, res, next) => {
  let { _id, uid } = req.query;
  try {
    user
      .findOne({ _id: uid })
      .then(async (doc) => {
        if (!doc.joinedEvent?.includes(_id)) {
          await user
            .updateOne(
              { _id: uid },
              { $push: { joinedEvent: _id }, $pull: { wishList: _id } }
            )
            .then((doc) =>
              res.status(200).send("You have joined the event successfully !!!")
            )
            .catch((er) => next(new Error("Invalid event id !!!")));
        } else {
          next(new Error("You have already joined !!!"));
        }
      })
      .catch((er) => next(new Error("Invalid user id !!!")));
  } catch (error) {
    next(new Error(error.message));
  }
};
// ! remove joined event
exports.removeJoinedEvent = async (req, res, next) => {
  let { _id, uid } = req.query;
  try {
    await user
      .updateOne({ _id: uid }, { $pull: { joinedEvent: _id } })
      .then((doc) => res.status(200).send("You have removed the event !!!"))
      .catch((er) => next(new Error("Invalid id !!!")));
  } catch (error) {
    next(new Error(error.message));
  }
};
// ! all upcoming event
exports.upcomingEvents = async (req, res, next) => {
  let currentDate = new Date();
  let { uid } = req.query;
  try {
    let allEvent = await event.find({});
    let othersEvent = allEvent.filter((data) => data.organizer != uid);
    let sortedEvents = othersEvent.sort((a, b) => {
      let diff1 = Math.abs(currentDate - a.date);
      let diff2 = Math.abs(currentDate - b.date);
      return diff1 - diff2;
    });
    res.send(sortedEvents);
  } catch (error) {
    next(new Error(error.message));
  }
};
// ! add wishlist
exports.addWishList = async (req, res, next) => {
  let { _id, uid } = req.query;
  try {
    user
      .findOne({ _id: uid })
      .then(async (doc) => {
        if (!doc.wishList?.includes(_id)) {
          await user
            .updateOne({ _id: uid }, { $push: { wishList: _id } })
            .then((doc) => res.status(200).send("Event added to wishlist  !!!"))
            .catch((er) => next(new Error("Invalid event id !!!")));
        } else {
          next(new Error("You have already joined !!!"));
        }
      })
      .catch((er) => next(new Error("Invalid user id !!!")));
  } catch (error) {
    next(new Error(error.message));
  }
};
exports.removeWatchList = async (req, res, next) => {
  let { _id, uid } = req.query;
  try {
    await user
      .updateOne({ _id: uid }, { $pull: { wishList: _id } })
      .then((doc) =>
        res.status(200).send("You have removed the event from you wishlist !!!")
      )
      .catch((er) => next(new Error("Invalid id !!!")));
  } catch (error) {
    next(new Error(error.message));
  }
};
