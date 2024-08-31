"use client";

import {
  Container,
  Grid,
  Card,
  Typography,
  CardContent,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import { LineChart, PieChart } from "@mui/x-charts";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DateRangeFilter from "@/components/DateRangeFilter";
import { useEffect, useState } from "react";
import { TransactionSummary } from "@/types/dashboard";
import { formatToIndianCurrency } from "@/lib/utils";
import { DateRange } from "@/types/date";
import { endOfMonth, startOfMonth, toDate } from "date-fns";
import { ToastService } from "@/services/ToastService";
import { getTransactionSummary } from "@/services/dashboard.action";

const toastService = new ToastService();

const DEFAULT_TRANSACTION_SUMMARY: TransactionSummary = {
  totalExpense: 0,
  expenseChange: 0,
  prevTotalExpense: 0,
  totalRevenue: 0,
  revenueChange: 0,
  prevTotalRevenue: 0,
  netBalance: 0,
  netBalanceChange: 0,
  prevNetBalance: 0,
};

const DEFAULT_DATE_RANGE: DateRange = {
  fromDate: startOfMonth(new Date()),
  toDate: endOfMonth(new Date()),
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange>(DEFAULT_DATE_RANGE);
  const [transactionSummary, setTransactionSummary] =
    useState<TransactionSummary>(DEFAULT_TRANSACTION_SUMMARY);

  useEffect(() => {
    async function init() {
      try {
        const response = await getTransactionSummary(dateRange);
        setTransactionSummary(response);
      } catch (error) {
        toastService.error("Error fetching dashboard stats");
      }
    }

    init();
  }, [
    JSON.stringify({
      fromDate: dateRange.fromDate.toISOString(),
      toDate: dateRange.toDate.toISOString(),
    }),
  ]);

  const NetChange = ({
    percentageChange,
    previousValue,
  }: {
    percentageChange: number;
    previousValue: number;
  }) => {
    let text = "";
    let textColor = "";
    if (percentageChange === 0) {
      text = "Stable";
    } else if (percentageChange > 0) {
      text = `+${percentageChange}%`;
      textColor = "success.main";
    } else {
      text = `${percentageChange}%`;
      textColor = "error";
    }

    return (
      <Box display="flex" alignItems="center" mt={1}>
        {percentageChange > 0 && (
          <ArrowUpwardIcon fontSize="small" color="success" />
        )}
        {percentageChange < 0 && (
          <ArrowDownwardIcon fontSize="small" color="error" />
        )}
        <Box component={"div"} className="flex flex-row">
          <Typography variant="body2" color={textColor} ml={0.5}>
            {text}
          </Typography>
          <Typography variant="body2" ml={1} color={"gray"}>
            from {formatToIndianCurrency(previousValue)}
          </Typography>
        </Box>
      </Box>
    );
  };

  const SummaryCard = ({ children }: { children: React.ReactNode }) => (
    <Card
      variant="outlined"
      className="rounded-[24px] p-1"
      sx={{
        boxShadow:
          "rgba(0, 0, 0, 0.04) 0px 5px 22px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px",
      }}
    >
      {children}
    </Card>
  );

  return (
    <Container className="m-0 p-0">
      <Grid
        container
        spacing={3}
        alignItems="center"
        justifyContent="space-between"
        className="p-8"
      >
        {/* Header */}
        <Grid item className="flex flex-row w-full justify-end">
          <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
        </Grid>

        {/* Summary Cards */}
        <Grid item container spacing={3}>
          <Grid item xs={12} md={4}>
            <SummaryCard>
              <CardContent className="flex flex-col gap-3">
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  className="font-bold"
                >
                  Total Income
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="success.main">
                  {`+ ₹${formatToIndianCurrency(
                    transactionSummary.totalRevenue
                  )}`}
                </Typography>
                <NetChange
                  percentageChange={transactionSummary.revenueChange}
                  previousValue={transactionSummary.prevTotalRevenue}
                />
              </CardContent>
            </SummaryCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard>
              <CardContent className="flex flex-col gap-3">
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  className="font-bold"
                >
                  Total Expenses
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="error.main">
                  {`- ₹${formatToIndianCurrency(
                    transactionSummary.totalExpense
                  )}`}
                </Typography>
                <NetChange
                  percentageChange={transactionSummary.expenseChange}
                  previousValue={transactionSummary.prevTotalExpense}
                />
              </CardContent>
            </SummaryCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <SummaryCard>
              <CardContent className="flex flex-col gap-3">
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  className="font-bold"
                >
                  Net Balance
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  color={
                    transactionSummary.netBalance >= 0
                      ? "success.main"
                      : "error"
                  }
                >
                  {transactionSummary.netBalance >= 0
                    ? `+ ₹${formatToIndianCurrency(
                        transactionSummary.netBalance
                      )}`
                    : `- ₹${formatToIndianCurrency(
                        transactionSummary.netBalance
                      )}`}
                </Typography>
                <NetChange
                  percentageChange={transactionSummary.netBalanceChange}
                  previousValue={transactionSummary.prevNetBalance}
                />
              </CardContent>
            </SummaryCard>
          </Grid>
        </Grid>

        {/* Charts Section */}
        {/* <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Income vs Expenses
                </Typography>
                <Divider sx={{ my: 2 }} />
                <LineChart data={incomeExpenseData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  Expense by Category
                </Typography>
                <Divider sx={{ my: 2 }} />
                <PieChart data={categoryData} />
              </CardContent>
            </Card>
          </Grid>
        </Grid> */}

        {/* Recent Transactions */}
        {/* <Grid container spacing={3} mt={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6" fontWeight="bold">
                      Recent Transactions
                    </Typography>
                    <IconButton></IconButton>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid> */}
      </Grid>
    </Container>
  );
};

export default Dashboard;
