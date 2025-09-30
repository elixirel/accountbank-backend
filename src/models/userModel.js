import pool from "../config/db.js";
import bcrypt from "bcrypt";

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
