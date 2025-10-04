import express from "express";
import * as service from "../services/userService.js";

const router = express.Router();

router.get("/:userId", service.getUserById);
router.post("/signup", service.addUser);
router.post("/login", service.login);
export default router;
