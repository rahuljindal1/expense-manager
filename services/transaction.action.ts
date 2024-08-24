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

export const listTransactions = async () => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as Transaction[]) || [];

  return { transactions: allTransactions, totalCount: allTransactions.length };
};
