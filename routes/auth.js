const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const User = require("../models/user");
const authController = require("../controllers/auth");

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email!")
      .normalizeEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already in use.");
          }
        });
      }),
  ],
  authController.signup
);

router.post("/login", authController.login);

module.exports = router;
