import { ITEMS_PER_PAGE } from "@/constants/Transaction";
import { Transaction } from "@/types/transaction";

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
}: {
  limit?: number;
  offset?: number;
}) => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];

  const filteredTransactions = allTransactions.slice(offset, limit);

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
