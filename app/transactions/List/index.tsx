"use client";

import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { Transaction } from "@/types/transaction";
import { truncateString } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { listTransactions } from "@/services/transaction.action";

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);

  const EmptyTransactionsMessage = () => {
    if (transactions.length > 0) {
      return <></>;
    }

    return (
      <Box component={"p"}>
        Oops! No transactions found. Lets trying adding one.
      </Box>
    );
  };

  const fetchTransaction = async () => {
    const { transactions, totalCount } = await listTransactions();
    console.log(transactions);
    setTransactions(transactions);
    setTotalCount(totalCount);
  };

  useEffect(() => {
    fetchTransaction();
  }, [currentPage]);

  return (
    <div className="space-y-4 flex flex-col justify-center items-center w-[100%]">
      <EmptyTransactionsMessage />
      <div className="w-[100%] h-[100%]">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex justify-between items-center p-4 border rounded-md shadow-sm "
          >
            <div className="flex flex-col">
              <Typography variant="subtitle2" className="text-gray-500">
                {new Date(transaction.transactionDate).toLocaleDateString()}
              </Typography>
              <Typography variant="h6" className="font-medium">
                {truncateString(transaction.description, 20)}
              </Typography>
            </div>
            <Typography
              variant="h6"
              className={`font-bold ${
                transaction.transactionType === "Expense"
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {transaction.transactionType === "Expense"
                ? `- ₹${transaction.amount}`
                : `+ ₹${transaction.amount}`}
            </Typography>
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalCount={Number(totalCount)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
