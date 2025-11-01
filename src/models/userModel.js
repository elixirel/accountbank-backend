import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { parseExpiresInToSeconds } from "../../utils/timeParser.js";

const saltrounds = 12;
const hashPassword = async (rawPassword) => {
  return await bcrypt.hash(rawPassword, saltrounds);
};
export async function getUserById(userId) {
  const [rows] = await pool.query("select * from user where uid = ?", [userId]);
  return rows;
}
export async function createUser(email, password) {
  const passwordHash = await hashPassword(password);

  const [result] = await pool.query(
    "insert into user(email, password) values(?,?)",
    [email, passwordHash]
  );
  return result.insertId;
}
async function getUserByEmail(email) {
  const [row] = await pool.query("select * from user where email = ?", [email]);
  return row[0];
}

export async function login(email, password) {
  const user = await getUserByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    const [row] = await pool.query(
      "select * from user_refresh_token where user_uid = ?",
      [user.uid]
    );
    if (row[0]) {
      await pool.query("delete from user_refresh_token where user_uid = ?", [
        user.uid,
      ]);
      return { login: false, errorCode: "LGIN002" };
    }
    const sessionId = uuid();
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
        sessionId: sessionId,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const refreshToken = jwt.sign(
      { uid: user.uid },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
    );

    const now = Math.floor(Date.now() / 1000);
    const expiresAt =
      now + parseExpiresInToSeconds(process.env.JWT_REFRESH_EXPIRES_IN);
    await pool.query(
      "insert into user_refresh_token (user_uid, session_id, refresh_token, created_at, expires_at) values ( ?, ?, ?, ?, ?)",
      [user.uid, sessionId, refreshToken, now, expiresAt]
    );
    return {
      login: true,
      message: "Login Success",
      token: token,
      refreshToken: refreshToken,
      sessionId: sessionId,
    };
  } else return { login: false, errorCode: "LGIN001" };
}

export async function logout(email) {
  const [row] = await pool.query("select uid from user where email = ?", email);
  console.log(row[0]);
  await pool.query(
    "delete from user_refresh_token where user_uid = ?",
    row[0].uid
  );
}
