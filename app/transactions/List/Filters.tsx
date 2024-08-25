import { Category } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Paper, IconButton, InputBase, Divider, Button } from "@mui/material";
import { useState } from "react";

import { SearchKeywordField } from "@/enums/TransactionType";
import { ToastService } from "@/services/ToastService";

const toastService = new ToastService();

export default function TransactionListFilters() {
  const [searchKeywordIn, setSearchKeywordIn] = useState<string[]>([
    SearchKeywordField.Category,
  ]);

  const handleSearchKeywordFieldChange = (field: SearchKeywordField) => {
    if (searchKeywordIn.includes(field)) {
      if (searchKeywordIn.length === 1) {
        toastService.error(
          "At least one search keyword should remain selected"
        );
        return;
      }

      setSearchKeywordIn(
        searchKeywordIn.filter((keywordField) => keywordField !== field)
      );
      return;
    }

    setSearchKeywordIn([...searchKeywordIn, field]);
  };

  return (
    <div className="w-[100%]">
      <Paper component="form" className="flex items-center py-1 px-2">
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={`Search by ${Object.values(searchKeywordIn).join(
            " or "
          )}`}
        />
        <IconButton type="button" className="p-2" aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <div className="mx-4 flex flex-row gap-2">
          {Object.values(SearchKeywordField).map((value, index) => (
            <Button
              key={index}
              variant={
                searchKeywordIn.includes(value) ? "contained" : "outlined"
              }
              size="small"
              onClick={() => {
                handleSearchKeywordFieldChange(value);
              }}
            >
              {value}
            </Button>
          ))}
        </div>
      </Paper>
    </div>
  );
}
