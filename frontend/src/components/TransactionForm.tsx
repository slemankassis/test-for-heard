import React, { useState } from "react";
import axios from "axios";

interface Props {
  onSuccess: () => void;
}

const TransactionForm: React.FC<Props> = ({ onSuccess }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/api/transactions", {
        title,
        description,
        amount,
        fromAccount,
        toAccount,
        transactionDate,
      });
      setTitle("");
      setDescription("");
      setAmount(0);
      setFromAccount("");
      setToAccount("");
      setTransactionDate("");
      onSuccess();
    } catch (error) {
      console.error("Error creating transaction", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-4 bg-white shadow-md rounded"
    >
      <h2 className="text-xl font-semibold mb-4">Create Transaction</h2>
      <div className="mb-4">
        <label className="block mb-2">Title</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Description</label>
        <textarea
          className="border rounded w-full p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Amount (cents)</label>
        <input
          type="number"
          className="border rounded w-full p-2"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">From Account</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={fromAccount}
          onChange={(e) => setFromAccount(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">To Account</label>
        <input
          type="text"
          className="border rounded w-full p-2"
          value={toAccount}
          onChange={(e) => setToAccount(e.target.value)}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2">Transaction Date</label>
        <input
          type="date"
          className="border rounded w-full p-2"
          value={transactionDate}
          onChange={(e) => setTransactionDate(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Create
      </button>
    </form>
  );
};

export default TransactionForm;
