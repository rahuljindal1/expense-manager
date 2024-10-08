"use client";

import { Pagination as MuiPagination } from "@mui/material";
import React from "react";

import { ITEMS_PER_PAGE } from "@/constants/Transaction";

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
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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
