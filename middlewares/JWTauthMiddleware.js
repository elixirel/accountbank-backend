import jwt from "jsonwebtoken";
import {pool} from "../config/db.js"
const parseHeader = (req) => {
  return { authHeader: req.get("authorization"), sessionId: req.get("x-session-id")}
}
export const verifyAccessToken = (req, res, next) => {
  const parsedHeader = parseHeader(req)
  if (!parsedHeader.authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errorCode: "AUTH002" });
  }
  const token = parsedHeader.authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ errorCode: "AUTH001" });
  }
};

export const verifyRefreshToken = async (req, res, next) => {
  const authHeader = req.get("authorization")
  const sessionId = req.get("x-session-id")
  if(authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      req.user = decoded;
    } catch (err) {

    }
  } else return res.status(401).json({ errorCode : "AUTH002"})
}