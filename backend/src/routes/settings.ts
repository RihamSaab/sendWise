import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// GET /api/settings
// Retrieve the user's current settings.
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        currency,
        starting_balance,
        TO_CHAR(tracking_start_date, 'YYYY-MM-DD') AS tracking_start_date,
        savings_percentage,
        savings_basis,
        onboarding_completed
      FROM settings
      WHERE id = 1
    `);

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Settings not found",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch settings:", error);

    res.status(500).json({
      message: "Failed to fetch settings",
    });
  }
});

// GET /api/settings/onboarding
// Retrieve all existing data needed by the onboarding flow.
router.get("/onboarding", async (_req, res) => {
  try {
    const [settingsResult, incomeResult, expensesResult, goalsResult] =
      await Promise.all([
        pool.query(`
        SELECT
          currency,
          starting_balance,
          TO_CHAR(tracking_start_date, 'YYYY-MM-DD')
            AS tracking_start_date,
          savings_percentage,
          savings_basis,
          onboarding_step,
          onboarding_completed
        FROM settings
        WHERE id = 1
      `),

        pool.query(`
        SELECT
          id,
          name,
          amount,
          frequency,
          TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
          TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
          notes,
          is_active
        FROM income_sources
        ORDER BY id ASC
      `),

        pool.query(`
        SELECT
          id,
          name,
          amount,
          frequency,
          TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
          TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
          notes,
          is_active
        FROM fixed_expenses
        ORDER BY id ASC
      `),

        pool.query(`
        SELECT
          id,
          name,
          target_amount,
          current_amount,
          TO_CHAR(target_date, 'YYYY-MM-DD') AS target_date,
          notes,
          is_active
        FROM financial_goals
        ORDER BY id ASC
      `),
      ]);

    if (settingsResult.rows.length === 0) {
      res.status(404).json({
        message: "Settings not found",
      });
      return;
    }

    res.json({
      settings: settingsResult.rows[0],
      incomeSources: incomeResult.rows,
      fixedExpenses: expensesResult.rows,
      financialGoals: goalsResult.rows,
    });
  } catch (error) {
    console.error("Failed to fetch onboarding data:", error);

    res.status(500).json({
      message: "Failed to fetch onboarding data",
    });
  }
});

// PUT /api/settings
// Update settings post-onboarding.
router.put("/", async (req, res) => {
  const {
    currency,
    starting_balance,
    tracking_start_date,
    savings_percentage,
    savings_basis,
  } = req.body;

  if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
    res.status(400).json({
      message: "Currency must be a valid three-letter uppercase code.",
    });
    return;
  }

  if (
    starting_balance === undefined ||
    starting_balance === null ||
    (typeof starting_balance !== "number" &&
      typeof starting_balance !== "string") ||
    String(starting_balance).trim() === "" ||
    !/^\d+(\.\d{1,2})?$/.test(String(starting_balance).trim()) ||
    !Number.isFinite(Number(starting_balance)) ||
    Number(starting_balance) < 0 ||
    Number(starting_balance) > 9999999999.99
  ) {
    res.status(400).json({
      message:
        "Starting balance must be non-negative with up to two decimal places.",
    });
    return;
  }

  if (
    typeof tracking_start_date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(tracking_start_date) ||
    !isValidDate(tracking_start_date)
  ) {
    res.status(400).json({
      message: "Tracking start date must be a valid YYYY-MM-DD date.",
    });
    return;
  }

  if (
    (typeof savings_percentage !== "number" &&
      typeof savings_percentage !== "string") ||
    String(savings_percentage).trim() === "" ||
    !/^\d+(\.\d{1,2})?$/.test(String(savings_percentage).trim()) ||
    !Number.isFinite(Number(savings_percentage)) ||
    Number(savings_percentage) < 0 ||
    Number(savings_percentage) > 100
  ) {
    res.status(400).json({
      message: "Savings percentage must be between 0 and 100.",
    });
    return;
  }

  if (!["income", "current_savings"].includes(savings_basis)) {
    res.status(400).json({
      message: "Savings basis must be income or current_savings.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE settings
       SET
         currency = $1,
         starting_balance = $2,
         tracking_start_date = $3::date,
         savings_percentage = $4,
         savings_basis = $5
       WHERE id = 1
       RETURNING
         currency,
         starting_balance,
         TO_CHAR(tracking_start_date, 'YYYY-MM-DD') AS tracking_start_date,
         savings_percentage,
         savings_basis,
         onboarding_completed`,
      [
        currency,
        String(starting_balance).trim(),
        tracking_start_date,
        String(savings_percentage).trim(),
        savings_basis,
      ],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Settings not found." });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to update settings:", error);
    res.status(500).json({ message: "Failed to update settings." });
  }
});

router.put("/onboarding/starting-point", async (req, res) => {
  const { currency, starting_balance, tracking_start_date } = req.body;

  // Validate currency.
  if (typeof currency !== "string" || !/^[A-Z]{3}$/.test(currency)) {
    res.status(400).json({
      message: "Currency must be a valid three-letter uppercase code.",
    });
    return;
  }

  // Validate starting balance.
  if (
    starting_balance === undefined ||
    starting_balance === null ||
    (typeof starting_balance !== "number" &&
      typeof starting_balance !== "string") ||
    String(starting_balance).trim() === "" ||
    !/^\d+(\.\d{1,2})?$/.test(String(starting_balance).trim()) ||
    !Number.isFinite(Number(starting_balance)) ||
    Number(starting_balance) < 0 ||
    Number(starting_balance) > 9999999999.99
  ) {
    res.status(400).json({
      message:
        "Starting balance must be a non-negative amount with at most two decimal places.",
    });
    return;
  }

  // Validate tracking start date.
  if (
    typeof tracking_start_date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(tracking_start_date) ||
    !isValidDate(tracking_start_date)
  ) {
    res.status(400).json({
      message: "Tracking start date must be a valid YYYY-MM-DD date.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `UPDATE settings
       SET
         currency = $1,
         starting_balance = $2,
         tracking_start_date = $3::date,
         onboarding_step = GREATEST(onboarding_step, 2)
       WHERE id = 1
       RETURNING
         currency,
         starting_balance,
         TO_CHAR(tracking_start_date, 'YYYY-MM-DD')
           AS tracking_start_date,
         onboarding_step,
         onboarding_completed`,
      [currency, String(starting_balance).trim(), tracking_start_date],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Settings not found.",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to save starting point:", error);

    res.status(500).json({
      message: "Failed to save starting point.",
    });
  }
});

router.put("/onboarding/income", async (req, res) => {
  const { incomeSources } = req.body;

  if (!Array.isArray(incomeSources)) {
    res.status(400).json({
      message: "incomeSources must be an array.",
    });
    return;
  }

  // Validate all entries before changing any database records.
  for (const source of incomeSources) {
    if (
      source === null ||
      typeof source !== "object" ||
      (source.id !== undefined &&
        (!Number.isInteger(source.id) || source.id <= 0)) ||
      typeof source.name !== "string" ||
      !source.name.trim() ||
      source.name.trim().length > 150 ||
      (typeof source.amount !== "number" &&
        typeof source.amount !== "string") ||
      String(source.amount).trim() === "" ||
      !/^\d+(\.\d{1,2})?$/.test(String(source.amount).trim()) ||
      !Number.isFinite(Number(source.amount)) ||
      Number(source.amount) <= 0 ||
      Number(source.amount) > 9999999999.99 ||
      !["weekly", "monthly", "yearly", "one_time"].includes(source.frequency) ||
      typeof source.start_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(source.start_date) ||
      !isValidDate(source.start_date) ||
      (source.end_date !== undefined &&
        source.end_date !== null &&
        (typeof source.end_date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(source.end_date) ||
          !isValidDate(source.end_date) ||
          source.end_date < source.start_date)) ||
      (source.notes !== undefined &&
        source.notes !== null &&
        typeof source.notes !== "string") ||
      (source.is_active !== undefined && typeof source.is_active !== "boolean")
    ) {
      res.status(400).json({
        message: "One or more income sources contain invalid data.",
      });
      return;
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Confirm onboarding settings exist.
    const settingsResult = await client.query(
      "SELECT id FROM settings WHERE id = 1 FOR UPDATE",
    );

    if (settingsResult.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({
        message: "Settings not found.",
      });
      return;
    }

    const savedSources = [];

    for (const source of incomeSources) {
      const values = [
        source.name.trim(),
        String(source.amount).trim(),
        source.frequency,
        source.start_date,
        source.end_date ?? null,
        source.notes?.trim() || null,
        source.is_active ?? true,
      ];

      if (source.id !== undefined) {
        const result = await client.query(
          `UPDATE income_sources
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
           RETURNING
             id,
             name,
             amount,
             frequency,
             TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
             TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
             notes,
             is_active`,
          [...values, source.id],
        );

        if (result.rows.length === 0) {
          throw Object.assign(
            new Error(`Income source ${source.id} was not found.`),
            { statusCode: 404 },
          );
        }

        savedSources.push(result.rows[0]);
      } else {
        const result = await client.query(
          `INSERT INTO income_sources (
             name,
             amount,
             frequency,
             start_date,
             end_date,
             notes,
             is_active
           )
           VALUES ($1, $2, $3, $4::date, $5::date, $6, $7)
           RETURNING
             id,
             name,
             amount,
             frequency,
             TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
             TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
             notes,
             is_active`,
          values,
        );

        savedSources.push(result.rows[0]);
      }
    }

    await client.query(
      `UPDATE settings
       SET onboarding_step = GREATEST(onboarding_step, 3)
       WHERE id = 1`,
    );

    await client.query("COMMIT");

    res.json({
      incomeSources: savedSources,
      onboarding_step: 3,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      error.statusCode === 404
    ) {
      res.status(404).json({
        message:
          error instanceof Error ? error.message : "Income source not found.",
      });
      return;
    }

    console.error("Failed to save income sources:", error);

    res.status(500).json({
      message: "Failed to save income sources.",
    });
  } finally {
    client.release();
  }
});

router.put("/onboarding/fixed-expenses", async (req, res) => {
  const { fixedExpenses } = req.body;

  if (!Array.isArray(fixedExpenses)) {
    res.status(400).json({
      message: "fixedExpenses must be an array.",
    });
    return;
  }

  // Validate all expenses before changing the database.
  for (const expense of fixedExpenses) {
    if (
      expense === null ||
      typeof expense !== "object" ||
      (expense.id !== undefined &&
        (!Number.isInteger(expense.id) || expense.id <= 0)) ||
      typeof expense.name !== "string" ||
      !expense.name.trim() ||
      expense.name.trim().length > 150 ||
      (typeof expense.amount !== "number" &&
        typeof expense.amount !== "string") ||
      String(expense.amount).trim() === "" ||
      !/^\d+(\.\d{1,2})?$/.test(String(expense.amount).trim()) ||
      !Number.isFinite(Number(expense.amount)) ||
      Number(expense.amount) <= 0 ||
      Number(expense.amount) > 9999999999.99 ||
      !["weekly", "monthly", "yearly", "one_time"].includes(
        expense.frequency,
      ) ||
      typeof expense.start_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(expense.start_date) ||
      !isValidDate(expense.start_date) ||
      (expense.end_date !== undefined &&
        expense.end_date !== null &&
        (typeof expense.end_date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(expense.end_date) ||
          !isValidDate(expense.end_date) ||
          expense.end_date < expense.start_date)) ||
      (expense.notes !== undefined &&
        expense.notes !== null &&
        typeof expense.notes !== "string") ||
      (expense.is_active !== undefined &&
        typeof expense.is_active !== "boolean")
    ) {
      res.status(400).json({
        message: "One or more fixed expenses contain invalid data.",
      });
      return;
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const settingsResult = await client.query(
      "SELECT id FROM settings WHERE id = 1 FOR UPDATE",
    );

    if (settingsResult.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({
        message: "Settings not found.",
      });
      return;
    }

    const savedExpenses = [];

    for (const expense of fixedExpenses) {
      const values = [
        expense.name.trim(),
        String(expense.amount).trim(),
        expense.frequency,
        expense.start_date,
        expense.end_date ?? null,
        expense.notes?.trim() || null,
        expense.is_active ?? true,
      ];

      if (expense.id !== undefined) {
        const result = await client.query(
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
           RETURNING
             id,
             name,
             amount,
             frequency,
             TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
             TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
             notes,
             is_active`,
          [...values, expense.id],
        );

        if (result.rows.length === 0) {
          throw Object.assign(
            new Error(`Fixed expense ${expense.id} was not found.`),
            { statusCode: 404 },
          );
        }

        savedExpenses.push(result.rows[0]);
      } else {
        const result = await client.query(
          `INSERT INTO fixed_expenses (
             name,
             amount,
             frequency,
             start_date,
             end_date,
             notes,
             is_active
           )
           VALUES ($1, $2, $3, $4::date, $5::date, $6, $7)
           RETURNING
             id,
             name,
             amount,
             frequency,
             TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
             TO_CHAR(end_date, 'YYYY-MM-DD') AS end_date,
             notes,
             is_active`,
          values,
        );

        savedExpenses.push(result.rows[0]);
      }
    }

    await client.query(
      `UPDATE settings
       SET onboarding_step = GREATEST(onboarding_step, 4)
       WHERE id = 1`,
    );

    await client.query("COMMIT");

    res.json({
      fixedExpenses: savedExpenses,
      onboarding_step: 4,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      error.statusCode === 404
    ) {
      res.status(404).json({
        message:
          error instanceof Error ? error.message : "Fixed expense not found.",
      });
      return;
    }

    console.error("Failed to save fixed expenses:", error);

    res.status(500).json({
      message: "Failed to save fixed expenses.",
    });
  } finally {
    client.release();
  }
});

router.put("/onboarding/savings", async (req, res) => {
  const { savings_percentage, savings_basis, financialGoals } = req.body;

  if (
    (typeof savings_percentage !== "number" &&
      typeof savings_percentage !== "string") ||
    String(savings_percentage).trim() === "" ||
    !/^\d+(\.\d{1,2})?$/.test(String(savings_percentage).trim()) ||
    !Number.isFinite(Number(savings_percentage)) ||
    Number(savings_percentage) < 0 ||
    Number(savings_percentage) > 100
  ) {
    res.status(400).json({
      message: "Savings percentage must be between 0 and 100.",
    });
    return;
  }

  if (!["income", "current_savings"].includes(savings_basis)) {
    res.status(400).json({
      message: "Savings basis must be income or current_savings.",
    });
    return;
  }

  if (!Array.isArray(financialGoals)) {
    res.status(400).json({
      message: "financialGoals must be an array.",
    });
    return;
  }

  for (const goal of financialGoals) {
    if (
      goal === null ||
      typeof goal !== "object" ||
      (goal.id !== undefined && (!Number.isInteger(goal.id) || goal.id <= 0)) ||
      typeof goal.name !== "string" ||
      !goal.name.trim() ||
      goal.name.trim().length > 150 ||
      (typeof goal.target_amount !== "number" &&
        typeof goal.target_amount !== "string") ||
      String(goal.target_amount).trim() === "" ||
      !/^\d+(\.\d{1,2})?$/.test(String(goal.target_amount).trim()) ||
      !Number.isFinite(Number(goal.target_amount)) ||
      Number(goal.target_amount) <= 0 ||
      Number(goal.target_amount) > 9999999999.99 ||
      (goal.current_amount !== undefined &&
        ((typeof goal.current_amount !== "number" &&
          typeof goal.current_amount !== "string") ||
          String(goal.current_amount).trim() === "" ||
          !/^\d+(\.\d{1,2})?$/.test(String(goal.current_amount).trim()) ||
          !Number.isFinite(Number(goal.current_amount)) ||
          Number(goal.current_amount) < 0 ||
          Number(goal.current_amount) > Number(goal.target_amount))) ||
      (goal.target_date !== undefined &&
        goal.target_date !== null &&
        (typeof goal.target_date !== "string" ||
          !/^\d{4}-\d{2}-\d{2}$/.test(goal.target_date) ||
          !isValidDate(goal.target_date))) ||
      (goal.notes !== undefined &&
        goal.notes !== null &&
        typeof goal.notes !== "string") ||
      (goal.is_active !== undefined && typeof goal.is_active !== "boolean")
    ) {
      res.status(400).json({
        message: "One or more financial goals contain invalid data.",
      });
      return;
    }
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const settingsResult = await client.query(
      "SELECT id FROM settings WHERE id = 1 FOR UPDATE",
    );

    if (settingsResult.rows.length === 0) {
      await client.query("ROLLBACK");
      res.status(404).json({
        message: "Settings not found.",
      });
      return;
    }

    const settingsUpdate = await client.query(
      `UPDATE settings
       SET
         savings_percentage = $1,
         savings_basis = $2,
         onboarding_step = GREATEST(onboarding_step, 5)
       WHERE id = 1
       RETURNING savings_percentage, savings_basis, onboarding_step`,
      [String(savings_percentage).trim(), savings_basis],
    );

    const savedGoals = [];

    for (const goal of financialGoals) {
      const values = [
        goal.name.trim(),
        String(goal.target_amount).trim(),
        String(goal.current_amount ?? 0).trim(),
        goal.target_date ?? null,
        goal.notes?.trim() || null,
        goal.is_active ?? true,
      ];

      if (goal.id !== undefined) {
        const result = await client.query(
          `UPDATE financial_goals
           SET
             name = $1,
             target_amount = $2,
             current_amount = $3,
             target_date = $4::date,
             notes = $5,
             is_active = $6
           WHERE id = $7
           RETURNING
             id,
             name,
             target_amount,
             current_amount,
             TO_CHAR(target_date, 'YYYY-MM-DD') AS target_date,
             notes,
             is_active`,
          [...values, goal.id],
        );

        if (result.rows.length === 0) {
          throw Object.assign(
            new Error(`Financial goal ${goal.id} was not found.`),
            { statusCode: 404 },
          );
        }

        savedGoals.push(result.rows[0]);
      } else {
        const result = await client.query(
          `INSERT INTO financial_goals (
             name,
             target_amount,
             current_amount,
             target_date,
             notes,
             is_active
           )
           VALUES ($1, $2, $3, $4::date, $5, $6)
           RETURNING
             id,
             name,
             target_amount,
             current_amount,
             TO_CHAR(target_date, 'YYYY-MM-DD') AS target_date,
             notes,
             is_active`,
          values,
        );

        savedGoals.push(result.rows[0]);
      }
    }

    await client.query("COMMIT");

    res.json({
      settings: settingsUpdate.rows[0],
      financialGoals: savedGoals,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    if (
      typeof error === "object" &&
      error !== null &&
      "statusCode" in error &&
      error.statusCode === 404
    ) {
      res.status(404).json({
        message:
          error instanceof Error ? error.message : "Financial goal not found.",
      });
      return;
    }

    console.error("Failed to save savings and goals:", error);

    res.status(500).json({
      message: "Failed to save savings and goals.",
    });
  } finally {
    client.release();
  }
});

router.put("/onboarding/complete", async (_req, res) => {
  try {
    const result = await pool.query(
      `UPDATE settings
       SET onboarding_completed = true
       WHERE id = 1
       RETURNING
         onboarding_step,
         onboarding_completed`,
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        message: "Settings not found.",
      });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to complete onboarding:", error);

    res.status(500).json({
      message: "Failed to complete onboarding.",
    });
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
