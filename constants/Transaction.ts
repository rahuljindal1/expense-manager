import { endOfMonth, startOfMonth } from "date-fns";

import { SearchKeywordField } from "@/enums/TransactionType";
import { SearchOptions } from "@/types/transaction";

export const ITEMS_PER_PAGE = 10;

export const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  keywordSearchFields: Object.values(SearchKeywordField),
  dateRange: {
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
  },
};
