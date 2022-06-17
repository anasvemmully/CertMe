const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Admin = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minLength: 2,
    },
    email: {
      type: String,
      required: [true, "*Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator: (email) => {
          return /[a-zA-Z0-9_\.\+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]+/.test(email);
        },
        message: "{VALUE} is not a valid email!",
      },
    },
    salt: {
      required: true,
      type: String,
    },
    password: {
      required: [true, "*Password is required"],
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", Admin);
