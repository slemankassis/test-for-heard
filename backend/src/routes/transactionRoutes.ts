import { Router, Request, Response } from "express";
import pool from "../db";
import { Transaction } from "../models/transaction";
import { v4 as uuidv4 } from "uuid";

const router = Router();

// CREATE a transaction
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      amount,
      fromAccount,
      toAccount,
      transactionDate,
    } = req.body;

    const transactionId = uuidv4();

    const insertText = `
      INSERT INTO transactions
      (transaction_id, title, description, amount, from_account, to_account, transaction_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const result = await pool.query(insertText, [
      transactionId,
      title,
      description,
      amount,
      fromAccount,
      toAccount,
      transactionDate,
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// READ all transactions
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions ORDER BY transaction_date ASC;"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// READ single transaction
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT * FROM transactions WHERE transaction_id = $1;",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

// UPDATE transaction
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      amount,
      fromAccount,
      toAccount,
      transactionDate,
    } = req.body;

    const updateText = `
      UPDATE transactions
      SET title = $1,
          description = $2,
          amount = $3,
          from_account = $4,
          to_account = $5,
          transaction_date = $6
      WHERE transaction_id = $7
      RETURNING *;
    `;
    const result = await pool.query(updateText, [
      title,
      description,
      amount,
      fromAccount,
      toAccount,
      transactionDate,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE transaction
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM transactions WHERE transaction_id = $1 RETURNING *;",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
