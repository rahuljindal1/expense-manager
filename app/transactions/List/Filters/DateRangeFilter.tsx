import { Box, Select, MenuItem } from "@mui/material";
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
import { useState } from "react";

import { DateRange } from "@/enums/Transaction";
import { SearchOptions } from "@/types/transaction";

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

export default function DateRangeFilter({
  searchOptions,
  setSearchOptions,
}: {
  searchOptions: SearchOptions;
  setSearchOptions: (newSearchOptions: SearchOptions) => void;
}) {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(
    DateRange.This_Month
  );

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

  return (
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
  );
}
