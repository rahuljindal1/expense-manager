"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

import { TRANSACTION_URL } from "@/constants/RedirectionUrl";

import TransactionEntryForm from "./Entry/form";
import TransactionList from "./List";
import { TransactionService } from "./services";

const transactionService = new TransactionService();

type SearchParamProps = {
  searchParams: {
    showTransactionModal?: boolean;
    transactionId?: string;
    appliedSearchOptions?: string;
    refetch?: boolean;
  };
};

export default function Transactions({
  searchParams: {
    showTransactionModal,
    transactionId,
    appliedSearchOptions,
    refetch,
  },
}: SearchParamProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen max-h-screen flex px-4 py-12 w-[100%]">
      <TransactionList
        appliedSearchOptions={transactionService.sanitizeSearchOptions(
          appliedSearchOptions
        )}
        refetch={refetch}
      />

      <div className="fixed bottom-4 right-4">
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className="rounded-full"
          onClick={() => {
            router.push(`${TRANSACTION_URL}?showTransactionModal=true`);
          }}
        >
          Add Transaction
        </Button>
      </div>
      {showTransactionModal && (
        <TransactionEntryForm transactionId={transactionId} />
      )}
    </div>
  );
}
