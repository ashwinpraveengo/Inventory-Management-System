const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/users");


// REGISTER
const register = async (req, res) => {
  try {

    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      imageUrl,
    } = req.body;

    const existingUser = await User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      imageUrl,
    });

    res.status(201).json({
      message: "User registered successfully",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};


// LOGIN
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: process.env.JWT_EXPIRES,
      }
    );

    res.status(200).json({
      token,

      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        imageUrl: user.imageUrl,
      },
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
};