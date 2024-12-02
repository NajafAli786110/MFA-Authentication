const authenticationCheckFor2FA = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Unauthorized: Please log in first" });
};

export default authenticationCheckFor2FA;