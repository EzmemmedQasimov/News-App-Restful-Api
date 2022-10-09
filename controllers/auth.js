const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed!",
      error: errors.array(),
    });
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;

  try {
    const hashedPass = await bcrypt.hash(password, 12);
    const user = new User({
      email: email,
      password: hashedPass,
      name: name,
    });
    const result = await user.save();
    res.status(201).json({ message: "User created!", userId: result._id });
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Email not found!" });
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      return res.status(401).json({ message: "Wrong password!" });
    }
    const token = jwt.sign(
      {
        email: loadedUser.email,
        userId: loadedUser._id.toString(),
      },
      "secretkey",
      { expiresIn: "1h" }
    );
    res.status(200).json({ token: token, userId: loadedUser._id.toString() });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
