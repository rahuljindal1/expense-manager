import UpArrow from "@mui/icons-material/North";
import DownArrow from "@mui/icons-material/South";
import { TableHead, TableRow, TableCell, Box } from "@mui/material";

import { SearchSortByOption, SearchSortOrderOption } from "@/enums/Transaction";
import { SearchOptions } from "@/types/transaction";

export default function TableHeaders({
  searchOptions,
}: {
  searchOptions: SearchOptions;
}) {
  const SortIcons = ({ sortBy }: { sortBy: SearchSortByOption }) => {
    if (searchOptions.sort.sortBy !== sortBy) {
      return <></>;
    }

    return (
      <>
        {searchOptions.sort.sortOrder === SearchSortOrderOption.DESC && (
          <DownArrow className="text-[16px]" />
        )}
        {searchOptions.sort.sortOrder === SearchSortOrderOption.ASC && (
          <UpArrow className="text-[16px]" />
        )}
      </>
    );
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <Box component={"div"} className="flex flex-row items-center gap-1">
            <Box component={"span"}>Date</Box>
            <SortIcons sortBy={SearchSortByOption.TransactionDate} />
          </Box>
        </TableCell>
        <TableCell>Description</TableCell>
        <TableCell align="center">Categories</TableCell>
        <TableCell align="right" className="flex flex-row justify-end">
          <Box component={"div"} className="flex flex-row items-center gap-1">
            {<Box component={"span"}>Amount</Box>}
            <SortIcons sortBy={SearchSortByOption.Amount} />
          </Box>
        </TableCell>
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
  );
}
