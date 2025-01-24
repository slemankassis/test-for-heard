import React, { useState } from "react";
import TransactionList from "./components/TransactionList";
import TransactionForm from "./components/TransactionForm";

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const handleRefresh = () => setRefreshKey((prev) => prev + 1);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Transactions List</h1>
      <TransactionForm onSuccess={handleRefresh} />
      <TransactionList key={refreshKey} />
    </div>
  );
};

export default App;
