import { Box, Divider } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import { DateRange } from "@/types/date";

export default function DateRangeFilter({
  dateRange,
  onChange,
}: {
  dateRange: DateRange;
  onChange: (newDateRange: DateRange) => void;
}) {
  const handleCustomDateChange = (key: "from" | "to", date: any) => {
    const fromDate = key === "from" ? date : dateRange.fromDate;
    const toDate = key === "to" ? date : dateRange.toDate;
    onChange({ fromDate, toDate });
  };

  return (
    <Box component={"div"} className="flex flex-col  gap-4">
      <div className="flex gap-2 items-center justify-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={dayjs(dateRange.fromDate)}
            onAccept={(date) => handleCustomDateChange("from", date)}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                paddingRight: "16px",
                boxShadow:
                  "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "14px",
              },
            }}
          />
        </LocalizationProvider>
        <Divider orientation="horizontal" className="w-[8px] bg-black" />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            value={dayjs(dateRange.toDate)}
            onAccept={(date) => handleCustomDateChange("to", date)}
            slotProps={{
              textField: {
                size: "small",
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                paddingRight: "16px",
                boxShadow:
                  "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
              },
              "& .MuiOutlinedInput-input": {
                fontSize: "14px",
              },
            }}
          />
        </LocalizationProvider>
      </div>
    </Box>
  );
}
