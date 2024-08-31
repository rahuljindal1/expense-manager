import { orderBy, sortBy } from "lodash";

import { CATEGORIES } from "@/constants/Categories";
import { SearchKeywordField, SearchSortOrderOption } from "@/enums/Transaction";
import { SearchOptions, Transaction } from "@/types/transaction";

import { KEY_NAMES, LocalForageService } from "./LocalForage";

const localForageService = new LocalForageService();

export const createNewTransaction = async (payload: Transaction) => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];
  allTransactions.push(payload);
  allTransactions.sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).valueOf()
  );
  await localForageService.setItem(KEY_NAMES.TRANSACTIONS, allTransactions);
};

export const editTransaction = async (payload: Transaction) => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];

  const index = allTransactions.findIndex(
    (transaction) => transaction.id === payload.id
  );
  if (index === -1) {
    throw new Error("No transaction found");
  }
  allTransactions[index] = payload;

  allTransactions.sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).valueOf()
  );
  await localForageService.setItem(KEY_NAMES.TRANSACTIONS, allTransactions);
};

export const listTransactions = async ({
  limit,
  offset,
  options,
}: {
  options: SearchOptions;
  limit?: number;
  offset?: number;
}) => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];

  let filteredTransactions = allTransactions.filter(
    (transaction) =>
      new Date(transaction.transactionDate).getTime() >=
        options?.dateRange.fromDate.getTime() &&
      new Date(transaction.transactionDate).getTime() <=
        options?.dateRange.toDate.getTime()
  );

  filteredTransactions = filteredTransactions.slice(offset, limit);
  if (options.keyword !== undefined) {
    filteredTransactions = filteredTransactions.filter((transaction) => {
      if (
        options.keywordSearchFields.includes(SearchKeywordField.Description)
      ) {
        if (
          transaction.description
            .toLowerCase()
            .includes(options?.keyword?.toLowerCase() as string)
        ) {
          return true;
        }
      }
      if (options.keywordSearchFields.includes(SearchKeywordField.Category)) {
        const categories = CATEGORIES.filter((category) =>
          transaction.categories?.includes(category.id)
        );
        return categories.some((category) =>
          category.name
            .toLowerCase()
            .includes(options?.keyword?.toLowerCase() as string)
        );
      }
      return false;
    });
  }

  if (options.sort) {
    filteredTransactions = orderBy(
      filteredTransactions,
      [options.sort.sortBy],
      [options.sort.sortOrder]
    );
  }

  return {
    transactions: filteredTransactions,
    totalCount: allTransactions.length,
  };
};

export const deleteTransaction = async (id: string) => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];

  const filteredTransactions = allTransactions.filter(
    (transaction) => transaction.id !== id
  );

  await localForageService.setItem(
    KEY_NAMES.TRANSACTIONS,
    filteredTransactions
  );
};

export const getTransactionById = async (id: string) => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];

  const transaction = allTransactions.find(
    (transaction) => transaction.id === id
  );
  if (!transaction) {
    throw new Error("No transaction found");
  }

  return transaction;
};
