function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user) {
      console.log("Forbidden: No user information found in request");
      return res.status(403).send("Forbidden: Authentication required");
    }

    const userRole = req.user.role;
    console.log(userRole);
    if (!userRole) {
      console.log("Forbidden: User role not found");
      return res.status(403).send("Forbidden: User role not found");
    }

    console.log("Checking role:", userRole);
    if (userRole === requiredRole) {
      next();
    } else {
      console.log("Forbidden: User does not have the required role");
      res.status(403).send("Forbidden: Insufficient permissions");
    }
  };
}

module.exports = checkRole;
