import pool from "../config/db.js";

export async function getAccountsByUser(userId) {
  const [rows] = await pool.query("select * from account where user_uid = ?", [
    userId,
  ]);
  return rows;
}
export async function createAccount(userId, balance, category) {
  const [result] = await pool.query(
    "insert into account(user_uid, balance, category) values(?,?,?)",
    [userId, balance, category]
  );
  return result.insertId;
}
