import { AddTransactionPayload } from "@/types/transaction";
import { KEY_NAMES, LocalForageService } from "./LocalForage";

const localForageService = new LocalForageService();

export const createNewTransaction = async (payload: AddTransactionPayload) => {
  const allTransactions =
    ((await localForageService.getItem(
      KEY_NAMES.TRANSACTIONS
    )) as AddTransactionPayload[]) || [];
  allTransactions.push(payload);
  allTransactions.sort(
    (a, b) =>
      new Date(b.transactionDate).getTime() -
      new Date(a.transactionDate).valueOf()
  );
  await localForageService.setItem(KEY_NAMES.TRANSACTIONS, allTransactions);
};
