import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../lib/utils.js";
export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "all fields are required" });
    }
    if (password < 6) {
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
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilepic: newUser.profilepic,
      });
      //send welcome email to user.
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
