import React, { useState } from "react";
import TransactionList from "./components/TransactionList";
import TransactionModal from "./components/TransactionModal";
import { Transaction } from "./types";

const App: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(
    null
  );
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setEditTransaction(transaction);
    } else {
      setEditTransaction(null);
    }
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">Transactions List</h1>
          <button
            onClick={() => openModal()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            + Add
          </button>
        </div>

        <TransactionList
          key={refreshKey}
          onEdit={openModal}
          onRefresh={handleRefresh}
        />

        {showModal && (
          <TransactionModal
            onClose={closeModal}
            onRefresh={handleRefresh}
            transaction={editTransaction}
          />
        )}
      </div>
    </div>
  );
};

export default App;
