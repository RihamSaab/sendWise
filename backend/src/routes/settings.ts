import { Router } from "express";
import { pool } from "../database.js";

const router = Router();

// Get the user's selected currency
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT currency FROM settings WHERE id = 1",
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Settings not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch settings:", error);

    res.status(500).json({
      message: "Failed to fetch settings",
    });
  }
});

export default router;
