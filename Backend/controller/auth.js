const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const svgCaptcha = require("svg-captcha");
const User = require("../models/users");
const { validationResult } = require("express-validator");

// Helper to send emails using Ethereal (for testing without real credentials)
const sendEmail = async (options) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"InventoryPro Support" <support@inventorypro.local>', // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    text: options.message, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

// CAPTCHA
const getCaptcha = (req, res) => {
  const captcha = svgCaptcha.create({
    size: 5,
    noise: 2,
    color: true,
  });
  
  const hash = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret')
                     .update(captcha.text.toLowerCase())
                     .digest('hex');

  res.cookie('captchaHash', hash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 10 * 60 * 1000 // 10 minutes
  });

  res.type('svg');
  res.status(200).send(captcha.data);
};

// HELPER for CAPTCHA
const verifyCaptcha = (req) => {
  const answer = req.body.captchaAnswer?.toLowerCase();
  const hash = req.cookies?.captchaHash;
  if (!answer || !hash) return false;
  const computedHash = crypto.createHmac('sha256', process.env.JWT_SECRET || 'secret')
                             .update(answer)
                             .digest('hex');
  return computedHash === hash;
};

// REGISTER
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!verifyCaptcha(req)) {
       return res.status(400).json({ errors: [{ path: 'captchaAnswer', msg: "Invalid CAPTCHA" }] });
    }

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      imageUrl,
    } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ errors: [{ path: 'email', msg: "Email already exists" }] });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      imageUrl,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    if (!verifyCaptcha(req)) {
       return res.status(400).json({ message: "Invalid CAPTCHA" });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
        phoneNumber: user.phoneNumber
      },
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
const logout = (req, res) => {
  res.clearCookie('token');
  res.clearCookie('captchaHash');
  res.status(200).json({ message: 'Logged out successfully' });
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({ message: 'No user found with that email address' });
    }

    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // Send email
    const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message
      });
      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save();
      console.log(err);
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');
    
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
      }
    });

    if (!user || user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // Set new password
    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PROFILE
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    
    // Check if an image was uploaded via multer
    if (req.file) {
      user.imageUrl = `http://localhost:4000/uploads/profiles/${req.file.filename}`;
    } else {
      user.imageUrl = req.body.imageUrl || user.imageUrl;
    }
    
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();

    // Re-issue token to update data
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    res.status(200).json({ message: "Profile updated", user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      imageUrl: user.imageUrl,
      phoneNumber: user.phoneNumber
    }});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  register,
  login,
  logout,
  getCaptcha,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile
};