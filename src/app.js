import express from "express";
import accountRoutes from "./routes/accountRoutes.js";

const app = express();
app.use(express.json());
app.use("/accounts", accountRoutes);

export default app;
