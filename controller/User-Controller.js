const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const { create } = require("../models/User");
const User = require("../models/User");

const createUser = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const all_errors = [];

    errors.array().map((err) => all_errors.push(err.msg));

    return res.send(all_errors);
  }

  const { name, userName, password } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user...please try again later",
      500
    );
    return next(error);
  }

  let createdUser = new User({
    name,
    userName,
    password: hashedPassword,
  });

  try {
    createdUser = await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Could not create user...please try again later",
      500
    );
    return next(error);
  }

  res.status(201).json({
    message: "User Created Successfully",
    name: createdUser.name,
    userName: createdUser.userName,
  });
};

const getUser = async (req, res, next) => {
  const uid = req.params.uid;

  let existing_user;

  try {
    existing_user = await User.findById(uid, "-password -_id  -__v");
  } catch (err) {
    const error = new HttpError(
      "Finding User Failed , please try again later",
      500
    );
    return next(error);
  }

  if (!existing_user) {
    return res.send("NO USERFOUND");
  }

  res.status(201).json(existing_user);
};

const getAllUsers = async (req, res, next) => {
  let all_users;

  try {
    all_users = await User.find({}, "-password -_id  -__v");
  } catch (err) {
    const error = new HttpError(
      "Finding Users Failed , please try again later",
      500
    );
    return next(error);
  }

  if (!all_users) {
    return res.status(400).send("NO USERS FOUND");
  }

  res.send(all_users);
};

const updateUser = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    const all_errors = [];

    errors.array().map((err) => all_errors.push(err.msg));

    return res.send(all_errors);
  }
  const uid = req.params.uid;
  let existing_user;

  try {
    existing_user = await User.findById(uid);
  } catch (err) {
    const error = new HttpError(
      "Updating User Failed , please try again later",
      500
    );
    return next(error);
  }

  if (!existing_user) {
    return res.send("NO USER FOUND");
  }

  existing_user.name = req.body.name ? req.body.name : existing_user.name;
  existing_user.userName = req.body.userName
    ? req.body.userName
    : existing_user.userName;

  let updated_user;
  try {
    updated_user = await existing_user.save({ new: true });
  } catch (err) {
    const error = new HttpError(
      "Updating User Failed , please try again later",
      500
    );
    return next(error);
  }

  res.json({
    message: "Update Successfully",
    name: updated_user.name,
    userName: updated_user.userName,
  });
};

const deleteUser = async (req, res, next) => {
  const uid = req.params.uid;

  let user_to_be_deleted;

  try {
    user_to_be_deleted = await User.findById(uid);
  } catch (err) {
    const error = new HttpError(
      "Deleting User Failed , please try again later",
      500
    );
    return next(error);
  }

  if (!user_to_be_deleted) {
    return res.status(400).send("NO USER FOUND");
  }

  try {
    await user_to_be_deleted.remove();
  } catch (err) {
    const error = new HttpError(
      "Deleting User Failed , please try again later",
      500
    );
    return next(error);
  }

  res.status(201).send("Deleted Successfully");
};

exports.createUser = createUser;
exports.getUser = getUser;
exports.getAllUsers = getAllUsers;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
