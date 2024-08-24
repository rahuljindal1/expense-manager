import { TransactionType } from "@/enums/TransactionType";
import { Dayjs } from "dayjs";

export type AddTransactionFormaValues = {
  id: string;
  description: string;
  amount: number | undefined;
  transactionType: TransactionType;
  transactionDate: Dayjs | null;
};

export type AddTransactionPayload = {
  id: string;
  description: string;
  amount: number;
  transactionType: TransactionType;
  transactionDate: string;
};
