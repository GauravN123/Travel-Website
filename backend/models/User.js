const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  // username: {
  //   type: String,
  //   required: [true, "Please enter an username"],
  //   unique: true,
  //   lowercase: true,
  // },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLength: [6, "Minimum password length is 6 characters."],
  },
  role: {
    type: String,
    enum: ["viewer", "subscriber"],
    default: "viewer",
  },

  // correctpassword: {
  //   type: String,
  //   required: [true, "Please enter a correct password"],
  //   minLength: [6, "Minimum password length is 6 characters."],
  // },
});

// fire a function aftter doc saved to db
userSchema.post("save", function (doc, next) {
  console.log("new user was created and saved", doc);
  next();
});

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};
const User = mongoose.model("user", userSchema);

module.exports = User;
