import { sendWelcomeEmail } from "../emails/emailHandlers.js";
import { ENV } from "../lib/env.js";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../lib/utils.js";
import "dotenv/config";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must be at least 6 characters" });
    }
    //check if email is valid
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email format is invalid" });
    }
    //checking if a user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "email already exists" });

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    //create new user
    const newUser = new User({
      fullname,
      email,
      password: hashedpassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(newUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilepic: newUser.profilepic,
      });
      try {
        await sendWelcomeEmail(
          savedUser.email,
          savedUser.fullname,
          ENV.CLIENT_URL
        );
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({
        message: "invalid user data",
      });
    }
  } catch (error) {
    console.log("error in signup controller");
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "invalid email or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilepic: user.profilepic,
    });
  } catch (error) {
    console.log("error in login controller");
    console.log(error);
    res.status(500).json({ message: "internal server error" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "logged out successfully" });
};
