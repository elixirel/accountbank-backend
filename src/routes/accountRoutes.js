import express from "express";
import * as service from "../services/accountService.js";

const router = express.Router();

router.get("/:userId", service.listAccounts);
router.post("/", service.addAccount);

export default router;
