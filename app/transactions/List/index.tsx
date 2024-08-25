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
import {
  deleteTransaction,
  listTransactions,
} from "@/services/transaction.action";
import dayjs from "dayjs";
import { ITEMS_PER_PAGE } from "@/constants/Transaction";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

export default function TransactionList({ refetch }: { refetch?: boolean }) {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const InitialLoad = () => {
    if (transactions.length > 0) {
      return null;
    }

    if (isLoading) {
      return <ClipLoader />;
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

    setIsLoading(true);
    try {
      const { transactions, totalCount } = await listTransactions({
        limit,
        offset,
      });
      setTransactions(transactions);
      setTotalCount(totalCount);
    } catch (error: any) {
      toast.error(error.message || "Some unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    await deleteTransaction(transactionId);
    toast.success("Transaction deleted successfully");

    await fetchTransaction(currentPage);
  };

  useEffect(() => {
    (async () => {
      await fetchTransaction(currentPage);
    })();
  }, [currentPage]);

  useEffect(() => {
    if (refetch) {
      (async () => {
        await fetchTransaction(1);
      })();
    }
  }, [refetch]);

  return (
    <div className="space-y-4 flex flex-col justify-center items-center w-[100%] gap-4">
      <InitialLoad />
      {transactions.length > 0 && (
        <TableContainer component={Paper} className="w-[100%] h-[100%]">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="left">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
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

                  <TableCell className="w-[60%] text-base ">
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
                    align="left"
                    className={`font-bold w-[10%] ${
                      transaction.transactionType === "Expense"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.transactionType === "Expense"
                      ? `- ₹${transaction.amount}`
                      : `+ ₹${transaction.amount}`}
                  </TableCell>

                  <TableCell align="center" className="w-[30%]">
                    <div className="flex flex-row gap-4rem items-center justify-center gap-4">
                      <Tooltip title="Edit">
                        <Box
                          className="cursor-pointer"
                          component={"div"}
                          onClick={() =>
                            router.push(
                              `/transactions?showTransactionModal=true&transactionId=${transaction.id}`
                            )
                          }
                        >
                          <EditIcon />
                        </Box>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <Box
                          className="cursor-pointer text-red-500"
                          component={"div"}
                          onClick={() =>
                            handleDeleteTransaction(transaction.id)
                          }
                        >
                          <DeleteIcon />
                        </Box>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Pagination
        currentPage={currentPage}
        totalCount={Number(totalCount)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
