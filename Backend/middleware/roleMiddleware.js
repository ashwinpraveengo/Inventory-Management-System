const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You don't have enough privileges.",
      });
    }
    next();
  };
};

module.exports = roleMiddleware;
