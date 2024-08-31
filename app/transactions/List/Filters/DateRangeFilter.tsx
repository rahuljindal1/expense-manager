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

import { DateRangeEnum } from "@/enums/Transaction";
import { DateRange } from "@/types/date";
import { SearchOptions } from "@/types/transaction";

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

export default function DateRangeFilter({
  dateRange,
  onChange,
}: {
  dateRange: DateRange;
  onChange: (newDateRange: DateRange) => void;
}) {
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeEnum>(
    DateRangeEnum.This_Month
  );

  const handleDateRangeChange = (value: DateRangeEnum) => {
    setSelectedDateRange(value);
    if (value !== DateRangeEnum.Custom) {
      onChange(getMappedDateRange[value]);
    }
  };

  const handleCustomDateChange = (key: "from" | "to", date: any) => {
    const fromDate = key === "from" ? date : dateRange.fromDate;
    const toDate = key === "to" ? date : dateRange.toDate;
    onChange({ fromDate, toDate });
  };

  return (
    <Box component={"div"} className="flex flex-col gap-4">
      <Select
        value={selectedDateRange}
        onChange={(e) =>
          handleDateRangeChange(e.target.value as unknown as DateRangeEnum)
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
              value={dayjs(dateRange.fromDate)}
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
              value={dayjs(dateRange.toDate)}
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
