const express = require("express");
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const authController = require("../controller/auth");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: "Too many login attempts from this IP, please try again after 15 minutes",
});

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Must be a valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/\d/)
      .withMessage("Password must contain a number")
      .matches(/[a-z]/)
      .withMessage("Password must contain a lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain an uppercase letter"),
    body("firstName").notEmpty().withMessage("First name is required"),
    body("lastName").notEmpty().withMessage("Last name is required"),
  ],
  authController.register
);

router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);

router.get("/captcha", authController.getCaptcha);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");
const multer = require("multer");

router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile/update", authMiddleware, (req, res, next) => {
  uploadMiddleware.single("profileImage")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "File too large. Maximum size is 10MB." });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ message: err.message || "File upload failed." });
    }
    next();
  });
}, authController.updateProfile);

router.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;