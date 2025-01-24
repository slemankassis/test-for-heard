import React, { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  transaction_id: string;
  title: string;
  description: string;
  amount: number;
  from_account: string;
  to_account: string;
  transaction_date: string;
}

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    (async function fetchData() {
      const res = await axios.get<Transaction[]>(
        "http://localhost:4000/api/transactions"
      );
      setTransactions(res.data);
    })();
  }, []);

  async function handleDelete(id: string) {
    await axios.delete(`http://localhost:4000/api/transactions/${id}`);
    setTransactions((prev) => prev.filter((tx) => tx.transaction_id !== id));
  }

  return (
    <div className="mt-8">
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4">Title</th>
            <th className="py-2 px-4">Description</th>
            <th className="py-2 px-4">Amount</th>
            <th className="py-2 px-4">From</th>
            <th className="py-2 px-4">To</th>
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.transaction_id} className="border-b">
              <td className="py-2 px-4">{tx.title}</td>
              <td className="py-2 px-4">{tx.description}</td>
              <td className="py-2 px-4">{tx.amount}</td>
              <td className="py-2 px-4">{tx.from_account}</td>
              <td className="py-2 px-4">{tx.to_account}</td>
              <td className="py-2 px-4">{tx.transaction_date}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDelete(tx.transaction_id)}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionList;
