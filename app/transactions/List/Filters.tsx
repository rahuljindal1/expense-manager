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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";

import { PRIMARY_BLUE, PRIMARY_BLUE_100 } from "@/constants/Colors";
import { SearchKeywordField } from "@/enums/TransactionType";
import { ToastService } from "@/services/ToastService";
import { SearchOptions } from "@/types/transaction";
import { debounce } from "@/lib/utils";
import { TRANSACTION_URL } from "@/constants/RedirectionUrl";

const toastService = new ToastService();

export default function TransactionListFilters() {
  const router = useRouter();
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    keywordSearchFields: Object.values(SearchKeywordField),
  });
  const [anchorElSearch, setAnchorElSearch] = useState<null | HTMLElement>(
    null
  );
  const [dateRange, setDateRange] = useState("");
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

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    if (value !== "custom") {
      setCustomDateRange({ from: null, to: null });
    }
  };

  const handleCustomDateChange = (key: "from" | "to", date: any) => {
    setCustomDateRange({ ...customDateRange, [key]: date });
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
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              displayEmpty
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value="" disabled>
                Select Date Range
              </MenuItem>
              <MenuItem value="today">Today</MenuItem>
              <MenuItem value="thisWeek">This Week</MenuItem>
              <MenuItem value="thisMonth">This Month</MenuItem>
              <MenuItem value="custom">Custom</MenuItem>
            </Select>

            {dateRange === "custom" && (
              <div className="flex gap-2">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="From Date"
                    value={customDateRange.from}
                    onChange={(date) => handleCustomDateChange("from", date)}
                    slotProps={{
                      textField: {
                        size: "small",
                      },
                    }}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="To Date"
                    value={customDateRange.to}
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
        <Button variant="outlined">Reset</Button>
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

  useEffect(() => {
    router.push(
      `transactions?appliedSearchOptions=${JSON.stringify(searchOptions)}`
    );
  }, []);

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
