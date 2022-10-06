const User = require("../models/user");
const { validationResult } = require("express-validator/check");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
exports.signup = (req, res, next) => {
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

  bcrypt
    .hash(password, 12)
    .then((hashedPass) => {
      const user = new User({
        email: email,
        password: hashedPass,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created!", userId: result._id });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Email not found!" });
      }
      loadedUser = user;
      return bcrypt.compare(password,user.password);
    })
    .then((isEqual) => {
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
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
