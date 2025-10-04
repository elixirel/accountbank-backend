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

export async function login(req, res) {
  const { email, password } = req.body;
  const login = await model.login(email, password);
  if (login.login) {
    res.json({ message: login.message, token: login.token });
  } else {
    res.status(500).json({ message: "Wrong password" });
  }
}
