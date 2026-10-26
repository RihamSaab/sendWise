import { Suspense } from "react";

import TransactionsList from "./components/transactionsList";

export default function TransactionsPage() {
  return (
    <Suspense fallback={<p>Loading transactions...</p>}>
      <TransactionsList />
    </Suspense>
  );
}
