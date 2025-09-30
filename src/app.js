import express from "express";
import accountRoutes from "./routes/accountRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();
app.use(express.json());
app.use("/accounts", accountRoutes);
app.use("/user", userRoutes);
export default app;
