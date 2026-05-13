const { body } = require("express-validator");

exports.registerValidation = [
  body("firstName")
    .trim()
    .escape()
    .isLength({ min: 2 }),

  body("lastName")
    .trim()
    .escape()
    .isLength({ min: 2 }),

  body("email")
    .isEmail()
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[0-9]/),

  body("phoneNumber")
    .isLength({ min: 10 }),
];

exports.loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail(),

  body("password")
    .notEmpty(),
];