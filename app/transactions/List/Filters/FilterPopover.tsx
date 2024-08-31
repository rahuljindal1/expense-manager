import {
  Popover,
  Paper,
  Box,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

import { DARK_500 } from "@/constants/Colors";
import { TRANSACTION_WITH_SEARCH_PARAMS } from "@/constants/RedirectionUrl";
import {
  SearchKeywordField,
  SearchSortOrderOption,
  SearchSortByOption,
} from "@/enums/Transaction";
import { ToastService } from "@/services/ToastService";
import { SearchOptions } from "@/types/transaction";

const toastService = new ToastService();

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
