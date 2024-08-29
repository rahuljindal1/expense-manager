import { SearchKeywordField } from "@/enums/TransactionType";
import { SearchOptions } from "@/types/transaction";

export class TransactionService {
  private readonly DEFAULT_SEARCH_OPTIONS: SearchOptions = {
    keywordSearchFields: Object.values(SearchKeywordField),
  };

  public sanitizeSearchOptions(appliedSearchOptions?: string): SearchOptions {
    let searchOptions = this.DEFAULT_SEARCH_OPTIONS;
    try {
      const parsedOptions = JSON.parse(appliedSearchOptions || "{}") as any;

      if (parsedOptions.keyword) {
        searchOptions.keyword = parsedOptions.keyword.trim();
      }

      if (
        parsedOptions.keywordSearchFields &&
        Array.isArray(parsedOptions.keywordSearchFields) &&
        parsedOptions.keywordSearchFields.length > 1 &&
        parsedOptions.every((option: SearchKeywordField) =>
          Object.values(SearchKeywordField).includes(option)
        )
      ) {
        parsedOptions.keywordSearchFields.forEach(
          (keywordField: SearchKeywordField) => {
            if (!searchOptions.keywordSearchFields.includes(keywordField)) {
              searchOptions.keywordSearchFields.push(keywordField);
            }
          }
        );
      }
    } catch (error) {}

    return searchOptions;
  }
}
