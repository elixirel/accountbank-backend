import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
const parseHeader = (req) => {
  return [req.get("authorization"), req.get("x-session-id")];
};
export const verifyAccessToken = async (req, res, next) => {
  const [authHeaderFromReq, sessionIdFromReq] = parseHeader(req);
  if (!authHeaderFromReq.startsWith("Bearer ")) {
    return res.status(401).json({ errorCode: "AUTH002" });
  }
  const token = authHeaderFromReq.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const userUid = payload.uid;
    const [sessionIdFromDB] = await pool.query(
      "select session_id from user_refresh_token where user_uid = ?",
      userUid
    );
    if (sessionIdFromReq != sessionIdFromDB)
      return res.status(401).json({ errorCode: "AUTH002" });
    const [email] = await pool.query(
      "select email from user where uid = ?",
      userUid
    );
    req.uid = userUid;
    req.email = email;
    req.sessionId = sessionIdFromDB;
    next();
  } catch (err) {
    return res.status(401).json({ errorCode: "AUTH001" });
  }
};

export const verifyRefreshToken = async (req, res, next) => {
  const [authHeaderFromReq, sessionIdFromReq] = parseHeader(req);
  if (!authHeaderFromReq.startsWith("Bearer ")) {
    return res.status(401).json({ errorCode: "AUTH002" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const userUid = payload.uid;
    const [refreshTokenFromDB, sessionIdFromDB] = await pool.query(
      "select refresh_token, session_id from user_refresh_token where user_uid = ?",
      userUid
    );
    if (refreshTokenFromDB != token)
      return res.status(401).json({ errorCode: "AUTH001" });
    if (sessionIdFromDB != sessionIdFromReq)
      await pool.query(
        "update user_refresh_token set session_id = ? where user_uid = ?",
        [sessionIdFromReq, userUid]
      );
    const email = await pool.query(
      "select email from user where uid = ?",
      userUid
    );
    const newAccessToken = jwt.sign(
      {
        uid: userUid,
        email: email,
        sessionId: sessionIdFromReq,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(401).json({ errorCode: "AUTH001" });
  }
};
