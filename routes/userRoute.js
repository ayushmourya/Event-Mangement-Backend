const express = require("express");
const router = express.Router();
const userController = require("../controller/userConteroller");
router.post("/create-user", userController.createUser);
router.put("/update-user", userController.updateUser);
router.get("/all-user", userController.getAllUser);
router.get("/single-user", userController.getSingleUser);
router.delete("/delete-user", userController.deleteUser);
module.exports = router;
