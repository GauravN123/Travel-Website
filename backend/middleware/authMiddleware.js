const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "gaurav secret", (err, decodedToken) => {
      if (err) {
        console.log("JWT verification error:", err.message);
        res.redirect("/login");
      } else {
        console.log("Decoded token:", decodedToken);
        req.user = decodedToken;
        next();
      }
    });
  } else {
    console.log("No token found");
    res.redirect("/login");
  }
};

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "gaurav secret", async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = { requireAuth, checkUser };
