export enum TransactionType {
  Expense = "Expense",
  Revenue = "Revenue",
}

export enum SearchKeywordField {
  Category = "Category",
  Description = "Description",
}

export enum SearchSortOrderOption {
  DESC = "desc",
  ASC = "asc",
}

export enum SearchSortByOption {
  Amount = "amount",
  TransactionDate = "transactionDate",
}

export enum DateRange {
  "Today" = "Today",
  "This_Month" = "This_Month",
  "This_Week" = "This_Week",
  "Custom" = "Custom",
}
