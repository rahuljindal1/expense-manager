import { isDate } from "date-fns";
import * as yup from "yup";

import { DEFAULT_SEARCH_OPTIONS } from "@/constants/Transaction";
import {
  SearchKeywordField,
  SearchSortOrderOption,
  SearchSortByOption,
} from "@/enums/Transaction";
import { SearchOptions } from "@/types/transaction";

const searchOptionsSchema = yup.object().shape({
  keyword: yup.string().trim(),
  dateRange: yup.object().shape({
    fromDate: yup
      .mixed()
      .test(
        "is-date",
        "fromDate must be a valid date",
        (value: any) =>
          value === undefined || new Date(value).toString() !== "Invalid Date"
      ),
    toDate: yup
      .mixed()
      .test("is-date", "toDate must be a valid date", (value: any) => {
        return (
          value === undefined || new Date(value).toString() !== "Invalid Date"
        );
      }),
  }),
  keywordSearchFields: yup
    .array()
    .of(yup.mixed().oneOf(Object.values(SearchKeywordField)))
    .min(1, "keywordSearchFields must contain at least one value"),
  sort: yup.object().shape({
    sortBy: yup.string().oneOf(Object.values(SearchSortByOption)),
    sortOrder: yup.string().oneOf(Object.values(SearchSortOrderOption)),
  }),
});

export class TransactionService {
  public sanitizeSearchOptions(appliedSearchOptions?: string): SearchOptions {
    let searchOptions = DEFAULT_SEARCH_OPTIONS;
    try {
      const parsedOptions = JSON.parse(appliedSearchOptions || "{}") as any;
      // Validate the parsedOptions against the Yup schema
      searchOptionsSchema.validateSync(parsedOptions);

      if (parsedOptions.keyword !== undefined) {
        searchOptions.keyword = parsedOptions.keyword.trim();
      }
      if (parsedOptions.dateRange !== undefined) {
        searchOptions.dateRange = {
          fromDate: new Date(parsedOptions.dateRange.fromDate),
          toDate: new Date(parsedOptions.dateRange.toDate),
        };
      }
      if (parsedOptions.keywordSearchFields !== undefined) {
        searchOptions.keywordSearchFields = parsedOptions.keywordSearchFields;
      }
      if (parsedOptions.sort !== undefined) {
        searchOptions.sort = parsedOptions.sort;
      }
    } catch (error) {
      console.log(error);
    }

    return searchOptions;
  }
}
