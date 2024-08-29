import { DEFAULT_SEARCH_OPTIONS } from "@/constants/Transaction";
import { SearchKeywordField } from "@/enums/TransactionType";
import { SearchOptions } from "@/types/transaction";

export class TransactionService {
  public sanitizeSearchOptions(appliedSearchOptions?: string): SearchOptions {
    let searchOptions = DEFAULT_SEARCH_OPTIONS;
    try {
      const parsedOptions = JSON.parse(appliedSearchOptions || "{}") as any;

      if (parsedOptions.keyword) {
        searchOptions.keyword = parsedOptions.keyword.trim();
      }

      if (
        parsedOptions.keywordSearchFields &&
        Array.isArray(parsedOptions.keywordSearchFields) &&
        parsedOptions.keywordSearchFields.length > 0 &&
        parsedOptions.keywordSearchFields.every((option: SearchKeywordField) =>
          Object.values(SearchKeywordField).includes(option)
        )
      ) {
        searchOptions.keywordSearchFields = parsedOptions.keywordSearchFields;
      }
    } catch (error) {}

    return searchOptions;
  }
}
