import React from "react";
import { Pagination as MuiPagination } from "@mui/material";

type PaginationProps = {
  currentPage: number;
  totalCount: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalCount,
  onPageChange,
}) => {
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  console.log(totalPages);

  return totalPages === 0 ? (
    <></>
  ) : (
    <MuiPagination
      className="flex justify-between items-center mt-4"
      count={totalPages}
      page={currentPage}
      onChange={(event: React.ChangeEvent<unknown>, value: number) =>
        onPageChange(value)
      }
    />
  );
};

export default Pagination;
