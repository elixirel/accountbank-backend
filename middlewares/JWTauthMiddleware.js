import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeater.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid or expired token provided" });
    }
  } else return res.status(401).json({ message: "No or wrong token provided" });
};
