"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Tooltip,
} from "@mui/material";
import { Transaction } from "@/types/transaction";
import { truncateString } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { listTransactions } from "@/services/transaction.action";
import dayjs from "dayjs";
import { ITEMS_PER_PAGE } from "@/constants/Transaction";

export default function TransactionList({ refetch }: { refetch?: boolean }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);

  const EmptyTransactionsMessage = () => {
    if (transactions.length > 0) {
      return null;
    }

    return (
      <Box component={"p"}>
        {"Oops! No transactions found. Let's try adding one"}.
      </Box>
    );
  };

  const fetchTransaction = async (currentPage: number) => {
    const limit = ITEMS_PER_PAGE * currentPage;
    const offset = ITEMS_PER_PAGE * (currentPage - 1);
    const { transactions, totalCount } = await listTransactions({
      limit,
      offset,
    });
    setTransactions(transactions);
    setTotalCount(totalCount);
  };

  useEffect(() => {
    fetchTransaction(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (refetch) {
      fetchTransaction(1);
    }
  }, [refetch]);

  return (
    <div className="space-y-4 flex flex-col justify-center items-center w-[100%] gap-4">
      <EmptyTransactionsMessage />
      <TableContainer component={Paper} className="w-[100%] h-[100%]">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="w-[20%]">
                  {dayjs(transaction.transactionDate).format(
                    "D MMM YYYY, h:mm A"
                  )}
                </TableCell>
                <TableCell className="w-[80%]">
                  <Tooltip
                    title={transaction.description}
                    placement="bottom-start"
                  >
                    <Box component={"p"} className="font-semibold">
                      {truncateString(transaction.description, 60)}
                    </Box>
                  </Tooltip>
                </TableCell>
                <TableCell
                  align="right"
                  className={`font-bold w-[20%] ${
                    transaction.transactionType === "Expense"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {transaction.transactionType === "Expense"
                    ? `- ₹${transaction.amount}`
                    : `+ ₹${transaction.amount}`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        currentPage={currentPage}
        totalCount={Number(totalCount)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
