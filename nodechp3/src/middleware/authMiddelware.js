import jwt from "jsonwebtoken";

function authenticateUser(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Usually the token is sent as "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    req.username = payload.username;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

export default authenticateUser;
