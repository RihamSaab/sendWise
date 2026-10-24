import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

router.get("/summary", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(
          SUM(amount) FILTER (WHERE type = 'income'),
          0
        ) AS income,
        COALESCE(
          SUM(amount) FILTER (WHERE type = 'expense'),
          0
        ) AS expenses
      FROM transactions
    `);

    const income = Number(result.rows[0].income);
    const expenses = Number(result.rows[0].expenses);

    res.json({
      income,
      expenses,
      net: income - expenses,
    });
  } catch (error) {
    console.error("Failed to retrieve transaction summary:", error);

    res.status(500).json({
      error: "Failed to retrieve transaction summary.",
    });
  }
});

router.get("/", async (req, res) => {
  const {
    search,
    type,
    category_id,
    start_date,
    end_date,
    page: pageQuery,
    pageSize: pageSizeQuery,
  } = req.query;

  function parsePositiveInteger(
    value: unknown,
    defaultValue: number,
  ): number | null {
    if (value === undefined) {
      return defaultValue;
    }

    if (
      typeof value !== "string" ||
      !/^[1-9]\d*$/.test(value) ||
      !Number.isSafeInteger(Number(value))
    ) {
      return null;
    }

    return Number(value);
  }

  const page = parsePositiveInteger(pageQuery, 1);
  const pageSize = parsePositiveInteger(pageSizeQuery, 10);

  if (page === null) {
    res.status(400).json({
      error: "Page must be a positive integer.",
    });
    return;
  }

  if (pageSize === null || ![5, 10, 25, 50].includes(pageSize)) {
    res.status(400).json({
      error: "Page size must be 5, 10, 25, or 50.",
    });
    return;
  }

  if (search !== undefined && typeof search !== "string") {
    res.status(400).json({
      error: "Search must be text.",
    });
    return;
  }

  if (type !== undefined && type !== "income" && type !== "expense") {
    res.status(400).json({
      error: "Type must be income or expense.",
    });
    return;
  }

  let categoryId: number | undefined;

  if (category_id !== undefined) {
    if (
      typeof category_id !== "string" ||
      !/^[1-9]\d*$/.test(category_id) ||
      !Number.isSafeInteger(Number(category_id))
    ) {
      res.status(400).json({
        error: "Category ID must be a positive integer.",
      });
      return;
    }

    categoryId = Number(category_id);
  }

  for (const [field, value] of [
    ["start_date", start_date],
    ["end_date", end_date],
  ] as const) {
    if (
      value !== undefined &&
      (typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
        !isValidDate(value))
    ) {
      res.status(400).json({
        error: `${field} must be a valid YYYY-MM-DD date.`,
      });
      return;
    }
  }

  if (
    typeof start_date === "string" &&
    typeof end_date === "string" &&
    start_date > end_date
  ) {
    res.status(400).json({
      error: "Start date cannot be after end date.",
    });
    return;
  }

  try {
    const conditions: Array<string> = [];
    const values: Array<string | number> = [];

    function addCondition(sql: string, value: string | number) {
      values.push(value);
      conditions.push(sql.replace("?", `$${values.length}`));
    }

    if (typeof search === "string" && search.trim()) {
      const escapedSearch = search.trim().replace(/[\\%_]/g, "\\$&");

      values.push(`%${escapedSearch}%`);
      const parameter = `$${values.length}`;

      conditions.push(
        `(t.title ILIKE ${parameter} ESCAPE '\\' OR c.name ILIKE ${parameter} ESCAPE '\\')`,
      );
    }

    if (type === "income" || type === "expense") {
      addCondition("t.type = ?", type);
    }

    if (categoryId !== undefined) {
      addCondition("t.category_id = ?", categoryId);
    }

    if (typeof start_date === "string") {
      addCondition("t.transaction_date >= ?::date", start_date);
    }

    if (typeof end_date === "string") {
      addCondition("t.transaction_date <= ?::date", end_date);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const countResult = await pool.query(
      `
        SELECT COUNT(*) AS total
        FROM transactions AS t
        JOIN categories AS c ON c.id = t.category_id
        ${whereClause}
      `,
      values,
    );

    const totalItems = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(totalItems / pageSize);
    const offset = (page - 1) * pageSize;

    const result = await pool.query(
      `
        SELECT
          t.id,
          t.title,
          t.amount,
          t.type,
          t.category_id,
          c.name AS category_name,
          TO_CHAR(t.transaction_date, 'YYYY-MM-DD') AS transaction_date,
          t.notes,
          t.created_at
        FROM transactions AS t
        JOIN categories AS c ON c.id = t.category_id
        ${whereClause}
        ORDER BY
          t.transaction_date DESC,
          t.created_at DESC,
          t.id DESC
        LIMIT $${values.length + 1}
        OFFSET $${values.length + 2}
      `,
      [...values, pageSize, offset],
    );

    res.json({
      data: result.rows,
      page,
      pageSize,
      totalItems,
      totalPages,
    });
  } catch (error) {
    console.error("Failed to retrieve transactions:", error);

    res.status(500).json({
      error: "Failed to retrieve transactions.",
    });
  }
});

router.get("/category-spending", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.name,
        SUM(t.amount) AS amount
      FROM transactions t
      JOIN categories c ON c.id = t.category_id
      WHERE t.type = 'expense'
      GROUP BY c.id, c.name
      ORDER BY SUM(t.amount) DESC
    `);

    res.json(
      result.rows.map((row) => ({
        name: row.name,
        amount: Number(row.amount),
      })),
    );
  } catch (error) {
    console.error("Failed to fetch category spending:", error);

    res.status(500).json({
      message: "Failed to fetch category spending",
    });
  }
});

router.post("/", async (req, res) => {
  const { title, amount, type, category_id, transaction_date, notes } =
    req.body;

  // Validate title.
  if (typeof title !== "string" || !title.trim() || title.trim().length > 150) {
    res.status(400).json({
      error: "A valid title is required (maximum 150 characters).",
    });
    return;
  }

  // Validate amount.
  if (
    amount === undefined ||
    amount === null ||
    (typeof amount === "string" && !amount.trim()) ||
    (typeof amount !== "string" && typeof amount !== "number") ||
    !Number.isFinite(Number(amount)) ||
    Number(amount) <= 0 ||
    !/^\d+(\.\d{1,2})?$/.test(String(amount).trim())
  ) {
    res.status(400).json({
      error: "Amount must be positive and have at most two decimal places.",
    });
    return;
  }

  // Validate transaction type.
  if (type !== "income" && type !== "expense") {
    res.status(400).json({
      error: "Type must be income or expense.",
    });
    return;
  }

  if (!Number.isInteger(category_id) || category_id <= 0) {
    res.status(400).json({
      error: "A valid category_id is required.",
    });
    return;
  }

  // Validate optional transaction date.
  if (
    transaction_date !== undefined &&
    (typeof transaction_date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(transaction_date) ||
      !isValidDate(transaction_date))
  ) {
    res.status(400).json({
      error: "Transaction date must be a valid YYYY-MM-DD date.",
    });
    return;
  }

  // Validate optional notes.
  if (notes !== undefined && notes !== null && typeof notes !== "string") {
    res.status(400).json({
      error: "Notes must be text.",
    });
    return;
  }

  try {
    const result = await pool.query(
      `INSERT INTO transactions (
        title,
        amount,
        type,
        category_id,
        transaction_date,
        notes
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        COALESCE($5::date, CURRENT_DATE),
        $6
      )
      RETURNING
        id,
        title,
        amount,
        type,
        category_id,
        TO_CHAR(transaction_date, 'YYYY-MM-DD') AS transaction_date,
        notes,
        created_at`,
      [
        title.trim(),
        String(amount).trim(),
        type,
        category_id,
        transaction_date ?? null,
        notes?.trim() || null,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    // PostgreSQL error code 23503 means a foreign-key violation.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23503"
    ) {
      res.status(400).json({
        error: "The selected category does not exist.",
      });
      return;
    }

    console.error("Failed to create transaction:", error);

    res.status(500).json({
      error: "Failed to create transaction.",
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
