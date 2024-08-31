import SearchIcon from "@mui/icons-material/Search";
import FilterIcon from "@mui/icons-material/Tune";
import {
  IconButton,
  Box,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";

import { PRIMARY_BLUE, PRIMARY_BLUE_100 } from "@/constants/Colors";
import {
  TRANSACTION_URL,
  TRANSACTION_WITH_SEARCH_PARAMS,
} from "@/constants/RedirectionUrl";
import { debounce } from "@/lib/utils";
import { DateRange } from "@/types/date";
import { SearchOptions } from "@/types/transaction";

import DateRangeFilter from "./DateRangeFilter";
import FilterOptionsPopover from "./FilterPopover";

export default function TransactionListFilters({
  defaultSearchOptions,
}: {
  defaultSearchOptions: SearchOptions;
}) {
  const router = useRouter();
  const [searchOptions, setSearchOptions] =
    useState<SearchOptions>(defaultSearchOptions);
  const [anchorElSearch, setAnchorElSearch] = useState<null | HTMLElement>(
    null
  );

  const handleSearchOptionClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSearch(event.currentTarget);
  };

  const onDateRangChange = (newDateRange: DateRange) => {
    const newSearchOptions = {
      ...searchOptions,
      dateRange: newDateRange,
    };
    setSearchOptions(newSearchOptions);
    router.push(
      `transactions?appliedSearchOptions=${JSON.stringify(newSearchOptions)}`
    );
  };

  const onKeywordSearch = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const trimmedKeyword = e.target.value.trim();
    const newSearchOptions = {
      ...searchOptions,
      keyword: trimmedKeyword,
    };
    setSearchOptions(newSearchOptions);
    router.push(
      `${TRANSACTION_URL}?appliedSearchOptions=${JSON.stringify(
        newSearchOptions
      )}`
    );
  };

  const OptionProviderIndicator = () => {
    return (
      <Tooltip title="Search Options Applied">
        <Box
          component={"div"}
          className="absolute rounded-full h-3 w-3 top-[-4px] right-[-4px]"
          sx={{
            backgroundColor: PRIMARY_BLUE,
            "& :hover": { backgroundColor: "white" },
          }}
        />
      </Tooltip>
    );
  };

  return (
    <div className="flex  items-center gap-2">
      <TextField
        placeholder={`Search by ${searchOptions.keywordSearchFields
          .join(" or ")
          .toLowerCase()}`}
        onChange={debounce(onKeywordSearch)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-input": {
            padding: "0.75rem 0.15rem",
          },
          minWidth: "300px",
        }}
      />

      <IconButton
        onClick={handleSearchOptionClick}
        className="p-[0.75rem] rounded-[4px] relative"
        sx={{
          color: PRIMARY_BLUE,
          backgroundColor: PRIMARY_BLUE_100,

          "&:hover": {
            color: "white",
            backgroundColor: PRIMARY_BLUE,
          },
        }}
      >
        <FilterIcon />
        <OptionProviderIndicator />
      </IconButton>

      <FilterOptionsPopover
        searchOptions={searchOptions}
        setSearchOptions={setSearchOptions}
        anchorEl={anchorElSearch}
        setAnchorEl={setAnchorElSearch}
      />

      <DateRangeFilter
        dateRange={searchOptions.dateRange}
        onChange={onDateRangChange}
      />
    </div>
  );
}
