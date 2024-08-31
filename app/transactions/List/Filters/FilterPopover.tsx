import {
  Popover,
  Paper,
  Box,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
} from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

import { DARK_500 } from "@/constants/Colors";
import {
  TRANSACTION_URL,
  TRANSACTION_WITH_SEARCH_PARAMS,
} from "@/constants/RedirectionUrl";
import {
  DateRangeEnum,
  SearchKeywordField,
  SearchSortOrderOption,
  SearchSortByOption,
} from "@/enums/Transaction";
import { ToastService } from "@/services/ToastService";
import { SearchOptions } from "@/types/transaction";

const toastService = new ToastService();

const getMappedDateRange = {
  [DateRangeEnum.Today]: {
    fromDate: startOfDay(new Date()),
    toDate: endOfDay(new Date()),
  },
  [DateRangeEnum.This_Week]: {
    fromDate: startOfWeek(new Date()),
    toDate: endOfWeek(new Date()),
  },
  [DateRangeEnum.This_Month]: {
    fromDate: startOfMonth(new Date()),
    toDate: endOfMonth(new Date()),
  },
};

export default function FilterOptionsPopover({
  searchOptions,
  setSearchOptions,
  anchorEl,
  setAnchorEl,
}: {
  searchOptions: SearchOptions;
  anchorEl: null | HTMLElement;
  setSearchOptions: (newSearchOptions: SearchOptions) => void;
  setAnchorEl: (el: null | HTMLElement) => void;
}) {
  const router = useRouter();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeEnum>(
    DateRangeEnum.This_Month
  );

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

  const handleDateRangeChange = (value: DateRangeEnum) => {
    setSelectedDateRange(value);
    if (value !== DateRangeEnum.Custom) {
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transitionDuration={0}
    >
      <Paper sx={{ boxShadow: `0px 0px 20px ${DARK_500}` }}>
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
                  handleDateRangeChange(
                    e.target.value as unknown as DateRangeEnum
                  )
                }
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
              >
                <MenuItem value="" disabled>
                  Select Date Range
                </MenuItem>
                <MenuItem value={DateRangeEnum.Today}>Today</MenuItem>
                <MenuItem value={DateRangeEnum.This_Week}>This Week</MenuItem>
                <MenuItem value={DateRangeEnum.This_Month}>This Month</MenuItem>
                <MenuItem value={DateRangeEnum.Custom}>Custom</MenuItem>
              </Select>

              {selectedDateRange === DateRangeEnum.Custom && (
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
            <div className="mb-2 font-bold">Sort Order</div>
            <Box component={"div"} className="flex flex-row gap-8">
              {Object.entries(SearchSortOrderOption).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={Boolean(searchOptions.sort.sortOrder === value)}
                      onChange={() =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            sortOrder: value,
                          },
                        })
                      }
                    />
                  }
                  label={key}
                />
              ))}
            </Box>
          </Box>

          <Box component={"div"}>
            <div className="mb-2 font-bold">Sort By</div>
            <Box component={"div"} className="flex flex-col ">
              {Object.entries(SearchSortByOption).map(([key, value]) => (
                <FormControlLabel
                  key={key}
                  control={
                    <Checkbox
                      checked={Boolean(searchOptions.sort.sortBy === value)}
                      onChange={() =>
                        setSearchOptions({
                          ...searchOptions,
                          sort: {
                            ...searchOptions.sort,
                            sortBy: value,
                          },
                        })
                      }
                    />
                  }
                  label={key}
                />
              ))}
            </Box>
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
      </Paper>
    </Popover>
  );
}
