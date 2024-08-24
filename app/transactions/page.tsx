"use client";

import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import TransactionEntry from "./Entry";
import TransactionList from "./List";

type SearchParamProps = {
  searchParams: {
    showAddTransactionModal?: boolean;
    refetch?: boolean;
  };
};

export default function Transactions({
  searchParams: { showAddTransactionModal, refetch },
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
            router.push("/transactions?showAddTransactionModal=true");
          }}
        >
          Add Transaction
        </Button>
      </div>
      {showAddTransactionModal && <TransactionEntry />}
    </div>
  );
}
