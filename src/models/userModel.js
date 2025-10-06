import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

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

export async function login(email, password, ipAddress, userAgent = null, sessionId = null) {
  const user = await getUserByEmail(email);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      {
        uid: user.uid,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    const refreshToken = jwt.sign({ uid: user.uid },
      process.env.JWT_REFRESH_SECRET,
      {expiresIn : process.env.JWT_REFRESH_EXPIRES_IN }
    );
    const [row] = await pool.query("select * from user_refresh_token where user_uid = ?", [user.uid])
    if(row) {
      const oldSession = row.session_id
      if(oldSession = sessionId) {
        await pool.query("update user_refresh_token set refresh_token = ?, user_agent = ?, ip_address = ? where user_uid = ?", [refreshToken, user.uid])
      } else {
        return { login : false, errorCode: "LGIN002" }
      }
    }
    return { login: true, message: "Login Success", token : token, refreshToken : refreshToken, sessionId : sessionId };
  } else return { login: false, errorCode: "LGIN001" };
}
