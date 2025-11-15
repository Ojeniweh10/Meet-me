import mongoose from "mongoose";

//creating a user schema
const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
      minlength: 6,
    },
    profilepic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } //this object will add created at and updated at.
);

//creating a user model based on the schema above
const User = mongoose.model("User", UserSchema);

export default User;
