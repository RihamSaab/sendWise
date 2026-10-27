import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

type GoalInput = {
  name?: unknown;
  target_amount?: unknown;
  current_amount?: unknown;
  target_date?: unknown;
  notes?: unknown;
  is_active?: unknown;
};

function validateGoal(body: GoalInput): string | null {
  if (
    typeof body.name !== "string" ||
    !body.name.trim() ||
    body.name.trim().length > 150
  ) {
    return "A valid name is required (max 150 characters).";
  }

  if (
    body.target_amount === undefined ||
    body.target_amount === null ||
    (typeof body.target_amount !== "string" &&
      typeof body.target_amount !== "number") ||
    String(body.target_amount).trim() === "" ||
    !/^\d+(\.\d{1,2})?$/.test(String(body.target_amount).trim()) ||
    !Number.isFinite(Number(body.target_amount)) ||
    Number(body.target_amount) <= 0 ||
    Number(body.target_amount) > 9999999999.99
  ) {
    return "Target amount must be positive with up to two decimal places.";
  }

  if (body.current_amount !== undefined && body.current_amount !== null) {
    if (
      (typeof body.current_amount !== "string" &&
        typeof body.current_amount !== "number") ||
      String(body.current_amount).trim() === "" ||
      !/^\d+(\.\d{1,2})?$/.test(String(body.current_amount).trim()) ||
      !Number.isFinite(Number(body.current_amount)) ||
      Number(body.current_amount) < 0 ||
      Number(body.current_amount) > Number(body.target_amount)
    ) {
      return "Current amount must be between 0 and the target amount.";
    }
  }

  if (
    body.target_date !== undefined &&
    body.target_date !== null &&
    (typeof body.target_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(body.target_date) ||
      !isValidDate(body.target_date))
  ) {
    return "Target date must be a valid YYYY-MM-DD date.";
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

function toValues(body: GoalInput): Array<string | boolean | null> {
  return [
    (body.name as string).trim(),
    String(body.target_amount).trim(),
    String(body.current_amount ?? 0).trim(),
    (body.target_date as string | undefined) ?? null,
    body.notes ? (body.notes as string).trim() || null : null,
    (body.is_active as boolean | undefined) ?? true,
  ];
}

const SELECT_FIELDS = `
  id,
  name,
  target_amount,
  current_amount,
  TO_CHAR(target_date, 'YYYY-MM-DD') AS target_date,
  notes,
  is_active
`;

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT ${SELECT_FIELDS} FROM financial_goals ORDER BY is_active DESC, id ASC`,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch financial goals:", error);
    res.status(500).json({ error: "Failed to fetch financial goals." });
  }
});

router.post("/", async (req, res) => {
  const error = validateGoal(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  try {
    const values = toValues(req.body);
    const result = await pool.query(
      `INSERT INTO financial_goals
         (name, target_amount, current_amount, target_date, notes, is_active)
       VALUES ($1, $2, $3, $4::date, $5, $6)
       RETURNING ${SELECT_FIELDS}`,
      values,
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to create financial goal:", error);
    res.status(500).json({ error: "Failed to create financial goal." });
  }
});

router.put("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: "A valid id is required." });
    return;
  }

  const error = validateGoal(req.body);
  if (error) {
    res.status(400).json({ error });
    return;
  }

  try {
    const values = toValues(req.body);
    const result = await pool.query(
      `UPDATE financial_goals
       SET
         name = $1,
         target_amount = $2,
         current_amount = $3,
         target_date = $4::date,
         notes = $5,
         is_active = $6
       WHERE id = $7
       RETURNING ${SELECT_FIELDS}`,
      [...values, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Financial goal not found." });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update financial goal:", error);
    res.status(500).json({ error: "Failed to update financial goal." });
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
      "DELETE FROM financial_goals WHERE id = $1 RETURNING id",
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Financial goal not found." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete financial goal:", error);
    res.status(500).json({ error: "Failed to delete financial goal." });
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
