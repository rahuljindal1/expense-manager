"use client";

import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

import { TRANSACTION_URL } from "@/constants/RedirectionUrl";
import { SearchKeywordField } from "@/enums/TransactionType";
import { SearchOptions } from "@/types/transaction";

import TransactionEntryForm from "./Entry/form";
import TransactionList from "./List";
import { TransactionService } from "./services";

const transactionService = new TransactionService();

type SearchParamProps = {
  searchParams: {
    showTransactionModal?: boolean;
    transactionId?: string;
    appliedSearchOptions?: string;
  };
};

export default function Transactions({
  searchParams: { showTransactionModal, transactionId, appliedSearchOptions },
}: SearchParamProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen max-h-screen flex px-4 py-12 w-screen">
      <TransactionList
        appliedSearchOptions={transactionService.sanitizeSearchOptions(
          appliedSearchOptions
        )}
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
