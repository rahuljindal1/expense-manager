"use client";

import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import TransactionEntry from "./Entry";

type SearchParamProps = {
  searchParams: {
    showAddTransactionModal?: boolean;
  };
};

export default function Transactions({
  searchParams: { showAddTransactionModal },
}: SearchParamProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex">
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
