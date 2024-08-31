import { DefaultizedPieValueType } from "@mui/x-charts";

export type TransactionSummary = {
  totalRevenue: number;
  prevTotalRevenue: number;
  revenueChange: number;
  totalExpense: number;
  prevTotalExpense: number;
  expenseChange: number;
  netBalance: number;
  prevNetBalance: number;
  netBalanceChange: number;
};

export type CategoryStat = {
  id: string;
  value: number;
  label: string;
};

export type TransactionCategoryStats = {
  data: CategoryStat[];
  arcLabel?: (params: DefaultizedPieValueType) => string;
};
