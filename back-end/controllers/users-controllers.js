const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");

    res.json({ users: users.map((user) => user.toObject({ getters: true })) });
  } catch (err) {
    return next(new HttpError("Fetching Users Failed.", 500));
  }
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Something wrong with values!", 422);

    return next(error);
  }

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(new HttpError("User exists.", 422));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const createdUser = new User({
      image: req.file.path,
      name,
      email,
      password: hashedPassword,
      posts: [],
    });

    await createdUser.save();

    const token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "secret_key",
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ userId: createdUser.id, email: createdUser.email, token });
  } catch (err) {
    return next(new HttpError("Signup Failed.", 500));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      return next(new HttpError("Not a Valid User!", 401));
    }

    const isValidPassword = await bcrypt.compare(password, validUser.password);

    if (!isValidPassword) {
      return next(new HttpError("Not a Valid Password!", 401));
    }

    const token = jwt.sign(
      { userId: validUser.id, email: validUser.email },
      "secret_key",
      { expiresIn: "1h" }
    );

    res
      .status(201)
      .json({ userId: validUser.id, email: validUser.email, token });
  } catch (err) {
    return next(new HttpError("Login Failed!", 500));
  }
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
