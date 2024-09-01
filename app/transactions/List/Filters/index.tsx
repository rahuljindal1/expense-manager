import FilterIcon from "@mui/icons-material/Tune";
import { IconButton, Box, TextField, Tooltip } from "@mui/material";
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

import FilterOptionsPopover from "./FilterPopover";
import DateRangeFilter from "../../../../components/DateRangeFilter";

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
    <div className="flex items-center gap-2 w-full justify-between">
      <DateRangeFilter
        dateRange={searchOptions.dateRange}
        onChange={onDateRangChange}
      />

      <Box component={"div"} className="flex flex-row gap-4">
        <TextField
          placeholder={`Search by ${searchOptions.keywordSearchFields
            .join(" or ")
            .toLowerCase()}`}
          onChange={debounce(onKeywordSearch)}
          sx={{
            "& .MuiOutlinedInput-input": {
              fontSize: "0.875rem",
              padding: "8px 12px",
            },
            minWidth: "220px",
          }}
        />

        <IconButton
          onClick={handleSearchOptionClick}
          className="p-[0.4rem] rounded-[4px] relative"
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
      </Box>
    </div>
  );
}
