const express = require("express");
const { check, oneOf } = require("express-validator");

const router = express.Router();

const userController = require("../controller/User-Controller");

router.post(
  "/createUser",
  [
    check("name").not().isEmpty().withMessage("Name can't be empty"),
    check("userName").not().isEmpty().withMessage("userName can't be empty"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Please provide password of atleast 6 characters"),
  ],
  userController.createUser
);

router.get("/getUser/:uid", userController.getUser);

router.get("/getAllUsers", userController.getAllUsers);

router.patch(
  "/updateUser/:uid",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage("Name can't be empty")
      .optional(),
    check("userName")
      .not()
      .isEmpty()
      .withMessage("userName can't be empty")
      .optional(),
  ],
  userController.updateUser
);

router.delete("/deleteUser/:uid", userController.deleteUser);

module.exports = router;
