"use client";

import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import TransactionEntry from "./Entry";
import TransactionList from "./List";
import { useEffect, useState } from "react";

type SearchParamProps = {
  searchParams: {
    showTransactionModal?: boolean;
    transactionId?: string;
    refetch?: boolean;
  };
};

export default function Transactions({
  searchParams: { showTransactionModal, transactionId, refetch },
}: SearchParamProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen max-h-screen flex px-4 py-12 w-screen">
      <TransactionList refetch={refetch} />

      <div className="fixed bottom-4 right-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className="rounded-full"
          onClick={() => {
            router.push("/transactions?showTransactionModal=true");
          }}
        >
          Add Transaction
        </Button>
      </div>
      {showTransactionModal && (
        <TransactionEntry transactionId={transactionId} />
      )}
    </div>
  );
}
