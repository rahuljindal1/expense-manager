import { Dayjs } from "dayjs";

import { TransactionType } from "@/enums/TransactionType";

export type AddTransactionFormaValues = {
  id: string;
  description: string;
  amount: number | undefined;
  transactionType: TransactionType;
  transactionDate: Dayjs | null;
  categories?: number[];
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  transactionType: TransactionType;
  transactionDate: string;
  categories?: number[];
};

export type SearchOptions = {
  keyword?: string;
  keywordSearchFields: string[];
  dateRange: { fromDate: Date; toDate: Date };
};
