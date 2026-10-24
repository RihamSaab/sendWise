
import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// GET /api/categories
// Retrieve all categories.
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        name,
        type,
        created_at
      FROM categories
      ORDER BY type ASC, name ASC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to retrieve categories:", error);

    res.status(500).json({
      error: "Failed to retrieve categories.",
    });
  }
});

export default router;
