import { Router, Request, Response } from "express";
import pool from "../db";
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

    const row = result.rows[0];
    return res.status(201).json({
      transactionId: row.transaction_id,
      title: row.title,
      description: row.description,
      amount: row.amount,
      fromAccount: row.from_account,
      toAccount: row.to_account,
      transactionDate: row.transaction_date,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create transaction" });
  }
});

// READ ALL
router.get("/", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions ORDER BY transaction_date ASC;"
    );

    const mapped = result.rows.map((row) => ({
      transactionId: row.transaction_id,
      title: row.title,
      description: row.description,
      amount: row.amount,
      fromAccount: row.from_account,
      toAccount: row.to_account,
      transactionDate: row.transaction_date,
    }));

    return res.json(mapped);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// READ SINGLE
router.get("/:transactionId", async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const result = await pool.query(
      "SELECT * FROM transactions WHERE transaction_id = $1;",
      [transactionId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const row = result.rows[0];
    return res.json({
      transactionId: row.transaction_id,
      title: row.title,
      description: row.description,
      amount: row.amount,
      fromAccount: row.from_account,
      toAccount: row.to_account,
      transactionDate: row.transaction_date,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

// UPDATE
router.put("/:transactionId", async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
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
      transactionId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const row = result.rows[0];
    return res.json({
      transactionId: row.transaction_id,
      title: row.title,
      description: row.description,
      amount: row.amount,
      fromAccount: row.from_account,
      toAccount: row.to_account,
      transactionDate: row.transaction_date,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE
router.delete("/:transactionId", async (req: Request, res: Response) => {
  try {
    const { transactionId } = req.params;
    const result = await pool.query(
      "DELETE FROM transactions WHERE transaction_id = $1 RETURNING *;",
      [transactionId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    return res.json({ message: "Transaction removed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete transaction" });
  }
});

export default router;
