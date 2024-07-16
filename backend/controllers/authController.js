const User = require("../models/User");
const jwt = require("jsonwebtoken");
<<<<<<< HEAD

=======
>>>>>>> origin/master
// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

<<<<<<< HEAD
  // incorrect email
=======
  // incorrect email\
>>>>>>> origin/master
  if (err.message === "incorrect email") {
    errors.email = "that email is not registered";
  }

<<<<<<< HEAD
  // incorrect password
  if (err.message === "incorrect password") {
    errors.email = "that password is incorrect";
  }

  // duplicate error code
=======
  if (err.message === "incorrect password") {
    errors.email = "that password is incorrect";
  }
  // duplicate error code

>>>>>>> origin/master
  if (err.code == "11000") {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
<<<<<<< HEAD
=======

>>>>>>> origin/master
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
<<<<<<< HEAD

=======
>>>>>>> origin/master
  return errors;
};

const maxAge = 3 * 24 * 60 * 60;
<<<<<<< HEAD
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // Include role in the payload
    "gaurav secret",
    {
      expiresIn: maxAge,
    }
  );
=======
const createToken = (id) => {
  return jwt.sign({ id }, "gaurav secret", {
    expiresIn: maxAge,
  });
>>>>>>> origin/master
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
<<<<<<< HEAD
    const token = createToken(user); // Pass user object to createToken
=======

    const token = createToken(user._id);
>>>>>>> origin/master
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
<<<<<<< HEAD
    const token = createToken(user); // Pass user object to createToken
=======
    const token = createToken(user._id);
>>>>>>> origin/master
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
