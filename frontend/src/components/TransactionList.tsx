import React, { useEffect, useState } from "react";
import axios from "axios";
import { Transaction } from "../types";

interface TransactionListProps {
  onEdit: (transaction: Transaction) => void;
  onRefresh: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  onEdit,
  onRefresh,
}) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async function fetchData() {
      const res = await axios.get<Transaction[]>(
        "http://localhost:4000/api/transactions"
      );
      setTransactions(res.data);
    })();
  }, [onRefresh]);

  const handleDelete = async (id: string) => {
    await axios.delete(`http://localhost:4000/api/transactions/${id}`);
    setTransactions((prev) => prev.filter((tx) => tx.transactionId !== id));
  };

  return (
    <div className="mt-4">
      <div className="overflow-x-auto shadow-sm rounded-md">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 border-b">
            <tr>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">From Account</th>
              <th className="py-3 px-4 text-left">To Account</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.transactionId} className="border-b">
                <td className="py-2 px-4">{tx.title}</td>
                <td className="py-2 px-4">{tx.description}</td>
                <td className="py-2 px-4">{tx.amount}</td>
                <td className="py-2 px-4">{tx.fromAccount}</td>
                <td className="py-2 px-4">{tx.toAccount}</td>
                <td className="py-2 px-4">{tx.transactionDate}</td>
                <td className="py-2 px-4 flex gap-2">
                  <button
                    onClick={() => onEdit(tx)}
                    className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(tx.transactionId)}
                    className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={7} className="py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
