import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { pool } from "./database.js";
import transactionsRouter from "./routes/transactions.js";
import categoriesRouter from "./routes/categories.js";
import settingsRouter from "./routes/settings.js";
import incomeSourcesRouter from "./routes/incomeSources.js";
import fixedExpensesRouter from "./routes/fixedExpenses.js";
import financialGoalsRouter from "./routes/financialGoals.js";
import authRouter from "./routes/auth.js";
import syncRouter from "./routes/sync.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

const frontendOrigin =
  process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/sync", syncRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/income-sources", incomeSourcesRouter);
app.use("/api/fixed-expenses", fixedExpensesRouter);
app.use("/api/financial-goals", financialGoalsRouter);

app.get("/api/health/database", async (_req, res) => {
  try {
    const result = await pool.query("SELECT current_database()");

    res.json({
      status: "ok",
      database: result.rows[0].current_database,
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`SpendWise API running at http://localhost:${PORT}`);
});
