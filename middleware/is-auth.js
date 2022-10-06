const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated!" });
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secretkey");
  } catch (error) {
    res.status(500);
    console.log(error);
  }
  if (!decodedToken) {
    return res.status(401).json({ message: "Not authenticated!" });
  }
  req.userId = decodedToken;
  next();
};
