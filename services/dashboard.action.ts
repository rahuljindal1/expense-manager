import { Transaction } from "@/types/transaction";
import { KEY_NAMES, LocalForageService } from "./LocalForage";
import { DateRange } from "@/types/date";
import { TransactionType } from "@/enums/Transaction";
import {
  CategoryStat,
  TransactionCategoryStats,
  TransactionSummary,
} from "@/types/dashboard";
import { CATEGORIES } from "@/constants/Categories";

const localForageService = new LocalForageService();

export const getTransactionSummary = async (
  dateRange: DateRange
): Promise<TransactionSummary> => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];

  let filteredTransactions = allTransactions.filter(
    (transaction) =>
      new Date(transaction.transactionDate).getTime() >=
        dateRange.fromDate.getTime() &&
      new Date(transaction.transactionDate).getTime() <=
        dateRange.toDate.getTime()
  );

  const totalRevenue = filteredTransactions.reduce((total, trx) => {
    if (trx.transactionType === TransactionType.Revenue) {
      return total + trx.amount;
    }
    return total;
  }, 0);
  const totalExpense = filteredTransactions.reduce((total, trx) => {
    if (trx.transactionType === TransactionType.Expense) {
      return total + trx.amount;
    }
    return total;
  }, 0);
  const netBalance = Number((totalRevenue - totalExpense).toFixed(2));

  const timeDifference =
    dateRange.toDate.getTime() - dateRange.fromDate.getTime();
  const previousFromDate = new Date(
    dateRange.fromDate.getTime() - timeDifference
  );
  const previousToDate = new Date(dateRange.fromDate.getTime());

  const previousFilteredTransactions = allTransactions.filter(
    (transaction) =>
      new Date(transaction.transactionDate).getTime() >=
        previousFromDate.getTime() &&
      new Date(transaction.transactionDate).getTime() <=
        previousToDate.getTime()
  );

  const previousTotalRevenue = previousFilteredTransactions.reduce(
    (total, trx) => {
      return trx.transactionType === TransactionType.Revenue
        ? total + trx.amount
        : total;
    },
    0
  );
  const previousTotalExpense = previousFilteredTransactions.reduce(
    (total, trx) => {
      return trx.transactionType === TransactionType.Expense
        ? total + trx.amount
        : total;
    },
    0
  );
  const previousNetBalance = Number(
    (previousTotalRevenue - previousTotalExpense).toFixed(2)
  );

  const revenueChange = previousTotalRevenue
    ? Number(
        (
          ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) *
          100
        ).toFixed(2)
      )
    : 0;
  const expenseChange = previousTotalExpense
    ? Number(
        (
          ((totalExpense - previousTotalExpense) / previousTotalExpense) *
          100
        ).toFixed(2)
      )
    : 0;
  const netBalanceChange = previousNetBalance
    ? Number(
        (
          ((netBalance - previousNetBalance) / previousNetBalance) *
          100
        ).toFixed(2)
      )
    : 0;

  return {
    totalExpense,
    expenseChange,
    totalRevenue,
    revenueChange,
    netBalance,
    netBalanceChange,
    prevTotalExpense: previousTotalExpense,
    prevTotalRevenue: previousTotalRevenue,
    prevNetBalance: previousNetBalance,
  };
};

export const getTransactionCategoryStats = async (
  dateRange: DateRange,
  transactionType: TransactionType
): Promise<TransactionCategoryStats> => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];

  let filteredTransactions = allTransactions.filter(
    (transaction) =>
      transaction.transactionType === transactionType &&
      new Date(transaction.transactionDate).getTime() >=
        dateRange.fromDate.getTime() &&
      new Date(transaction.transactionDate).getTime() <=
        dateRange.toDate.getTime()
  );

  const data: CategoryStat[] = [];
  for (const transaction of filteredTransactions) {
    const categories: typeof CATEGORIES = [];
    transaction.categories?.forEach((categoryId) => {
      const category = CATEGORIES.find(
        (category) => category.id === categoryId
      );
      if (category) {
        categories.push(category);
      }
    });

    categories.forEach((category) => {
      const existingDataIndex = data.findIndex(
        (el) => el.id === String(category.id)
      );
      if (existingDataIndex === -1) {
        data.push({
          id: String(category.id),
          value: transaction.amount,
          label: category.name,
        });
      } else {
        data[existingDataIndex].value += transaction.amount;
      }
    });
  }

  return { data };
};
