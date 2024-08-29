"use client";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
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
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import Loader from "@/components/Loader";
import Pagination from "@/components/Pagination";
import { CATEGORIES } from "@/constants/Categories";
import { DARK_200 } from "@/constants/Colors";
import { UNEXPECTED_ERROR } from "@/constants/Error";
import { ITEMS_PER_PAGE } from "@/constants/Transaction";
import { cn, formatToIndianCurrency, truncateString } from "@/lib/utils";
import { ToastService } from "@/services/ToastService";
import {
  deleteTransaction,
  listTransactions,
} from "@/services/transaction.action";
import { SearchOptions, Transaction } from "@/types/transaction";

import TransactionListFilters from "./Filters";

const toastService = new ToastService();

export default function TransactionList({
  refetch,
  searchFilters,
}: {
  refetch?: boolean;
  searchFilters?: SearchOptions;
}) {
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
      return <Loader />;
    }

    return (
      <Box component={"p"}>
        {"Oops! No transactions found. Let's try adding one"}.
      </Box>
    );
  };

  const fetchTransactions = async (currentPage: number) => {
    const limit = ITEMS_PER_PAGE * currentPage;
    const offset = ITEMS_PER_PAGE * (currentPage - 1);

    setIsLoading(true);
    try {
      const { transactions, totalCount } = await listTransactions({
        limit,
        offset,
        filters: searchFilters,
      });
      setTransactions(transactions);
      setTotalCount(totalCount);
    } catch (error: any) {
      toastService.error(error.message || UNEXPECTED_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    await deleteTransaction(transactionId);
    toastService.success("Transaction deleted successfully");

    await fetchTransactions(currentPage);
  };

  useEffect(() => {
    (async () => {
      await fetchTransactions(currentPage);
    })();
  }, [currentPage]);

  useEffect(() => {
    if (refetch) {
      (async () => {
        await fetchTransactions(1);
      })();
    }
  }, [refetch]);

  return (
    <div className="space-y-4 flex flex-col justify-center items-center w-[100%]">
      <InitialLoad />
      <TransactionListFilters />
      {transactions.length > 0 && (
        <TableContainer
          component={Paper}
          className="w-[100%] h-[100%]"
          sx={{ border: DARK_200, boxShadow: "none" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="center">Categories</TableCell>
                <TableCell align="right">Amount</TableCell>
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

                  <TableCell className="w-[35%] text-base">
                    <Tooltip
                      title={transaction.description}
                      placement="bottom-start"
                    >
                      <Box component={"p"} className="font-semibold">
                        {truncateString(transaction.description, 60)}
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell align="center" className="w-[20%] relative">
                    <div className="flex justify-center items-center gap-2">
                      {transaction.categories?.map((categoryId, index) => {
                        const category = CATEGORIES.find(
                          (cat) => cat.id === categoryId
                        );

                        if (!category) {
                          return <></>;
                        }

                        return (
                          <Chip
                            key={category.id}
                            label={category.name}
                            icon={
                              <category.icon className="text-gray-700 w-4 h-4" />
                            }
                            className="text-xs"
                          />
                        );
                      })}
                    </div>
                  </TableCell>

                  <TableCell
                    align="right"
                    className={`font-bold w-[15%] ${
                      transaction.transactionType === "Expense"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.transactionType === "Expense"
                      ? `- ₹${formatToIndianCurrency(transaction.amount)}`
                      : `+ ₹${formatToIndianCurrency(transaction.amount)}`}
                  </TableCell>

                  <TableCell align="center" className="w-[10%]">
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
