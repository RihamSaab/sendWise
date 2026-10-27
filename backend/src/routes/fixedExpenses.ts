import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

const FREQUENCIES = ["weekly", "monthly", "yearly", "one_time"] as const;

type ExpenseInput = {
  name?: unknown;
  amount?: unknown;
  frequency?: unknown;
  start_date?: unknown;
  end_date?: unknown;
  notes?: unknown;
  is_active?: unknown;
};

function validateExpense(body: ExpenseInput): string | null {
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.trim().length > 150
  ) {
    return "A valid name is required (max 150 characters).";
  }

  if (
    body.amount === undefined ||
    body.amount === null ||
    (typeof body.amount !== "string" && typeof body.amount !== "number") ||
    String(body.amount).trim() === "" ||
    !/^\d+(\.\d{1,2})?$/.test(String(body.amount).trim()) ||
    !Number.isFinite(Number(body.amount)) ||
    Number(body.amount) <= 0 ||
    Number(body.amount) > 9999999999.99
  ) {
    return "Amount must be positive with up to two decimal places.";
  }

  if (!FREQUENCIES.includes(body.frequency as (typeof FREQUENCIES)[number])) {
    return "Frequency must be weekly, monthly, yearly, or one_time.";
  }

  if (
    typeof body.start_date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(body.start_date) ||
    !isValidDate(body.start_date)
  ) {
    return "Start date must be a valid YYYY-MM-DD date.";
  }

  if (
    body.end_date !== undefined &&
    body.end_date !== null &&
    (typeof body.end_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.end_date) ||
      !isValidDate(body.end_date) ||
      body.end_date < body.start_date)
  ) {
    return "End date must be on or after the start date.";
  }

  if (
    body.notes !== undefined &&
    body.notes !== null &&
    typeof body.notes !== "string"
  ) {
    return "Notes must be text.";
  }

  if (body.is_active !== undefined && typeof body.is_active !== "boolean") {
    return "is_active must be a boolean.";
  }

  return null;
}

function toValues(body: ExpenseInput): Array<string | boolean | null> {
  return [
    (body.name as string).trim(),
    String(body.amount).trim(),
    body.frequency as string,
    body.start_date as string,
    (body.end_date as string | undefined) ?? null,
    body.notes ? (body.notes as string).trim() || null : null,
    (body.is_active as boolean | undefined) ?? true,
  ];
}

const SELECT_FIELDS = `
  id,
  name,
  amount,
  frequency,
  TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
  TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
  notes,
  is_active
`;

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM fixed_expenses ORDER BY is_active DESC, id ASC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch fixed expenses:", error);
    res.status(500).json({ error: "Failed to fetch fixed expenses." });
  }
});

router.post("/", async (req, res) => {
  const error = validateExpense(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  try {
    const values = toValues(req.body);
    const result = await pool.query(
      `INSERT INTO fixed_expenses
         (name, amount, frequency, start_date, end_date, notes, is_active)
       VALUES ($1, $2, $3, $4::date, $5::date, $6, $7)
       RETURNING ${SELECT_FIELDS}`,
      values,
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create fixed expense:", error);
    res.status(500).json({ error: "Failed to create fixed expense." });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "A valid id is required." });
    return;
  }

  const error = validateExpense(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  try {
    const values = toValues(req.body);
    const result = await pool.query(
      `UPDATE fixed_expenses
       SET
         name = $1,
         amount = $2,
         frequency = $3,
         start_date = $4::date,
         end_date = $5::date,
         notes = $6,
         is_active = $7,
         updated_at = NOW()
       WHERE id = $8
       RETURNING ${SELECT_FIELDS}`,
      [...values, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Fixed expense not found." });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update fixed expense:", error);
    res.status(500).json({ error: "Failed to update fixed expense." });
  }
});

router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "A valid id is required." });
    return;
  }

  try {
    const result = await pool.query(
      "DELETE FROM fixed_expenses WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Fixed expense not found." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete fixed expense:", error);
    res.status(500).json({ error: "Failed to delete fixed expense." });
  }
});

function isValidDate(value: string): boolean {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export default router;
