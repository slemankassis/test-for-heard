import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Transaction } from "../types";

interface TransactionModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onRefresh: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  transaction,
  onClose,
  onRefresh,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const isEditMode = !!transaction;

  useEffect(() => {
    if (transaction) {
      setTitle(transaction.title);
      setDescription(transaction.description);
      setAmount(transaction.amount);
      setFromAccount(transaction.fromAccount);
      setToAccount(transaction.toAccount);
      setTransactionDate(transaction.transactionDate);
    } else {
      setTitle("");
      setDescription("");
      setAmount(0);
      setFromAccount("");
      setToAccount("");
      setTransactionDate("");
    }
  }, [transaction]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      title,
      description,
      amount,
      fromAccount,
      toAccount,
      transactionDate,
    };

    try {
      if (isEditMode && transaction) {
        await axios.put(
          `http://localhost:4000/api/transactions/${transaction.transactionId}`,
          payload
        );
      } else {
        await axios.post("http://localhost:4000/api/transactions", payload);
      }

      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to save transaction:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md mx-4 relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Update Transaction" : "Create Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            &times;
          </button>
        </div>

        <form className="p-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Title</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Description</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Amount (cents)</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </div>

          <div>
            <label className="block mb-1">From Account</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">To Account</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Transaction Date</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 border rounded hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {isEditMode ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
