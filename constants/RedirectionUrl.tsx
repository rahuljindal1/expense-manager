import { DEFAULT_SEARCH_OPTIONS } from "./Transaction";

export const TRANSACTION_URL = `transactions`;
export const TRANSACTION_WITH_SEARCH_PARAMS = `transactions?appliedSearchOptions=${JSON.stringify(
  DEFAULT_SEARCH_OPTIONS
)}`;
