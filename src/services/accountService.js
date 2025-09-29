import * as model from "../models/accountModel.js";

export async function listAccounts(req, res) {
  try {
    const userId = req.params.userId;
    const accounts = await model.getAccountsByUser(userId);
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addAccount(req, res) {
  try {
    const { userId, balance, category } = req.body;
    const newId = await model.createAccount(userId, balance, category);
    res.json({ id: newId, message: "account created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
