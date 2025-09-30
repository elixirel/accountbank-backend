import * as model from "../models/userModel.js";

export async function getUserById(req, res) {
  try {
    const userId = req.params.userId;
    const user = await model.getUserById(userId);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function addUser(req, res) {
  try {
    const { email, password } = req.body;
    const newId = await model.createUser(email, password);
    res.json({ id: newId, message: "account created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
