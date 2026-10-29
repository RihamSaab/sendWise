import { Router } from "express";

import { pool } from "../database.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";

const router = Router();

type IncomingSettings = {
  currency?: string;
  starting_balance?: number;
  tracking_start_date?: string;
  savings_percentage?: number;
  savings_basis?: "income" | "current_savings";
  onboarding_step?: number;
  onboarding_completed?: boolean;
};

type IncomingTransaction = {
  title: string;
  amount: number;
  type: "income" | "expense";
  category_id: number;
  transaction_date: string;
  notes: string | null;
};

type IncomingRecurring = {
  name: string;
  amount: number;
  frequency: "weekly" | "monthly" | "yearly" | "one_time";
  start_date: string;
  end_date: string | null;
  notes: string | null;
  is_active: boolean;
};

type IncomingGoal = {
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  notes: string | null;
  is_active: boolean;
};

type UploadPayload = {
  settings?: IncomingSettings | null;
  transactions?: Array<IncomingTransaction>;
  incomeSources?: Array<IncomingRecurring>;
  fixedExpenses?: Array<IncomingRecurring>;
  financialGoals?: Array<IncomingGoal>;
};

router.post("/upload", requireAuth, async (req: AuthedRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    res.status(401).json({ error: "Not signed in" });
    return;
  }

  const payload = (req.body ?? {}) as UploadPayload;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query("DELETE FROM transactions WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM income_sources WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM fixed_expenses WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM financial_goals WHERE user_id = $1", [userId]);
    await client.query("DELETE FROM settings WHERE user_id = $1", [userId]);

    if (payload.settings) {
      const s = payload.settings;
      await client.query(
        `INSERT INTO settings (
          user_id, currency, starting_balance, tracking_start_date,
          savings_percentage, savings_basis, onboarding_step, onboarding_completed
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          s.currency ?? "USD",
          s.starting_balance ?? 0,
          s.tracking_start_date ?? new Date().toISOString().slice(0, 10),
          s.savings_percentage ?? 0,
          s.savings_basis ?? "income",
          s.onboarding_step ?? 1,
          s.onboarding_completed ?? false,
        ],
      );
    }

    for (const transaction of payload.transactions ?? []) {
      await client.query(
        `INSERT INTO transactions (
          user_id, title, amount, type, category_id, transaction_date, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userId,
          transaction.title,
          transaction.amount,
          transaction.type,
          transaction.category_id,
          transaction.transaction_date,
          transaction.notes,
        ],
      );
    }

    for (const source of payload.incomeSources ?? []) {
      await client.query(
        `INSERT INTO income_sources (
          user_id, name, amount, frequency, start_date, end_date, notes, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          source.name,
          source.amount,
          source.frequency,
          source.start_date,
          source.end_date,
          source.notes,
          source.is_active,
        ],
      );
    }

    for (const expense of payload.fixedExpenses ?? []) {
      await client.query(
        `INSERT INTO fixed_expenses (
          user_id, name, amount, frequency, start_date, end_date, notes, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          userId,
          expense.name,
          expense.amount,
          expense.frequency,
          expense.start_date,
          expense.end_date,
          expense.notes,
          expense.is_active,
        ],
      );
    }

    for (const goal of payload.financialGoals ?? []) {
      await client.query(
        `INSERT INTO financial_goals (
          user_id, name, target_amount, current_amount, target_date, notes, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          userId,
          goal.name,
          goal.target_amount,
          goal.current_amount,
          goal.target_date,
          goal.notes,
          goal.is_active,
        ],
      );
    }

    await client.query("COMMIT");
    res.json({ ok: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Sync upload failed:", error);
    res.status(500).json({ error: "Could not save your plan." });
  } finally {
    client.release();
  }
});

export default router;
