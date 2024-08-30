import SearchIcon from "@mui/icons-material/Search";
import FilterIcon from "@mui/icons-material/Tune";
import {
  Paper,
  IconButton,
  InputBase,
  Divider,
  Button,
  Popover,
  FormControlLabel,
  Checkbox,
  Box,
  MenuItem,
  Select,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import {
  DatePicker,
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

import { PRIMARY_BLUE, PRIMARY_BLUE_100 } from "@/constants/Colors";
import {
  TRANSACTION_URL,
  TRANSACTION_WITH_SEARCH_PARAMS,
} from "@/constants/RedirectionUrl";
import { SearchKeywordField } from "@/enums/TransactionType";
import { debounce } from "@/lib/utils";
import { ToastService } from "@/services/ToastService";
import { SearchOptions } from "@/types/transaction";

const toastService = new ToastService();

enum DateRange {
  "Today" = "Today",
  "This_Month" = "This_Month",
  "This_Week" = "This_Week",
  "Custom" = "Custom",
}

const getMappedDateRange = {
  [DateRange.Today]: {
    fromDate: startOfDay(new Date()),
    toDate: endOfDay(new Date()),
  },
  [DateRange.This_Week]: {
    fromDate: startOfWeek(new Date()),
    toDate: endOfWeek(new Date()),
  },
  [DateRange.This_Month]: {
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
  },
};

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
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(
    DateRange.This_Month
  );
  const [customDateRange, setCustomDateRange] = useState({
    from: null,
    to: null,
  });

  const handleSearchKeywordFieldChange = (field: SearchKeywordField) => {
    if (searchOptions.keywordSearchFields?.includes(field)) {
      if (searchOptions.keywordSearchFields.length === 1) {
        toastService.error(
          "At least one search keyword should remain selected"
        );
        return;
      }

      setSearchOptions({
        ...searchOptions,
        keywordSearchFields: searchOptions.keywordSearchFields?.filter(
          (keywordField) => keywordField !== field
        ),
      });
      return;
    }

    setSearchOptions({
      ...searchOptions,
      keywordSearchFields: [
        ...(searchOptions.keywordSearchFields || []),
        field,
      ],
    });
  };

  const handleSearchOptionClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElSearch(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElSearch(null);
  };

  const handleDateRangeChange = (value: DateRange) => {
    setSelectedDateRange(value);
    if (value !== DateRange.Custom) {
      setSearchOptions({
        ...searchOptions,
        dateRange: getMappedDateRange[value],
      });
    }
  };

  const handleCustomDateChange = (key: "from" | "to", date: any) => {
    const fromDate = key === "from" ? date : searchOptions.dateRange.fromDate;
    const toDate = key === "to" ? date : searchOptions.dateRange.toDate;
    setSearchOptions({ ...searchOptions, dateRange: { fromDate, toDate } });
  };

  const areSearchOptionsProvided =
    searchOptions.keywordSearchFields?.length &&
    searchOptions.keywordSearchFields?.length > 0;

  const OptionProviderIndicator = () => {
    if (!areSearchOptionsProvided) {
      return <></>;
    }

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

  const SearchOptionPopover = () => (
    <Popover
      open={Boolean(anchorElSearch)}
      anchorEl={anchorElSearch}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box
        p={2}
        component={"div"}
        className="flex flex-col gap-4 min-w-[360px]"
      >
        <Box component={"div"}>
          <div className="mb-2 font-bold">Date Time Range</div>
          <Box component={"div"} className="flex flex-col gap-4">
            <Select
              value={selectedDateRange}
              onChange={(e) =>
                handleDateRangeChange(e.target.value as unknown as DateRange)
              }
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                Select Date Range
              </MenuItem>
              <MenuItem value={DateRange.Today}>Today</MenuItem>
              <MenuItem value={DateRange.This_Week}>This Week</MenuItem>
              <MenuItem value={DateRange.This_Month}>This Month</MenuItem>
              <MenuItem value={DateRange.Custom}>Custom</MenuItem>
            </Select>

            {selectedDateRange === DateRange.Custom && (
              <div className="flex gap-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="From Date"
                    value={dayjs(searchOptions.dateRange.fromDate)}
                    onChange={(date) => handleCustomDateChange("from", date)}
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="To Date"
                    value={dayjs(searchOptions.dateRange.toDate)}
                    onChange={(date) => handleCustomDateChange("to", date)}
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>
            )}
          </Box>
        </Box>

        <Box component={"div"} className="flex flex-col">
          <div className="mb-2 font-bold">Search In</div>
          {Object.keys(SearchKeywordField).map((keywordField) => (
            <FormControlLabel
              key={keywordField}
              control={
                <Checkbox
                  checked={searchOptions.keywordSearchFields?.includes(
                    SearchKeywordField[keywordField as SearchKeywordField]
                  )}
                  onChange={() =>
                    handleSearchKeywordFieldChange(
                      SearchKeywordField[keywordField as SearchKeywordField]
                    )
                  }
                />
              }
              label={keywordField}
            />
          ))}
        </Box>

        <Box component={"div"}>
          <div className="mb-2 font-bold">Sort By</div>
          <FormControlLabel control={<Checkbox />} label="Amount" />
        </Box>
      </Box>

      <Divider orientation="horizontal" />

      <Box component={"div"} p={2} className="flex justify-end gap-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            router.push(
              `transactions?appliedSearchOptions=${JSON.stringify(
                searchOptions
              )}`
            );
            handleClose();
          }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            router.push(TRANSACTION_WITH_SEARCH_PARAMS);
            handleClose();
          }}
        >
          Reset
        </Button>
      </Box>
    </Popover>
  );

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

  return (
    <div className="flex justify-end w-full items-center gap-2">
      <TextField
        placeholder="Search"
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
          minWidth: "260px",
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

      <SearchOptionPopover />
    </div>
  );
}
