import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

import Loader from "@/components/Loader";
import Modal from "@/components/Modal";
import { CATEGORIES } from "@/constants/Categories";
import { UNEXPECTED_ERROR } from "@/constants/Error";
import { TRANSACTION_WITH_SEARCH_PARAMS } from "@/constants/RedirectionUrl";
import { TransactionType } from "@/enums/Transaction";
import { cn } from "@/lib/utils";
import { ToastService } from "@/services/ToastService";
import {
  createNewTransaction,
  editTransaction,
  getTransactionById,
} from "@/services/transaction.action";
import { AddTransactionFormaValues } from "@/types/transaction";

import { validationSchema } from "./formValidator";

const toastService = new ToastService();

export default function TransactionEntry({
  transactionId,
}: {
  transactionId?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    typeof CATEGORIES
  >([]);

  const formik = useFormik<AddTransactionFormaValues>({
    initialValues: {
      id: uuidV4(),
      description: "",
      amount: undefined,
      transactionType: TransactionType.Expense,
      transactionDate: dayjs(),
      categories: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (transactionId) {
          await editTransaction({
            ...values,
            amount: values.amount as number,
            transactionDate: values.transactionDate!.toISOString(),
          });
          toastService.success("Transaction edited successfully");
        } else {
          await createNewTransaction({
            ...values,
            amount: values.amount as number,
            transactionDate: values.transactionDate!.toISOString(),
          });
          toastService.success("Transaction added successfully");
        }
        router.replace(`${TRANSACTION_WITH_SEARCH_PARAMS}&refetch=true`);
      } catch (error: any) {
        toastService.error(error.message || UNEXPECTED_ERROR);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const fetchTransaction = async (transactionId: string) => {
    setIsLoading(true);
    try {
      const transaction = await getTransactionById(transactionId);
      formik.setValues({
        id: transaction.id,
        description: transaction.description,
        amount: transaction.amount,
        transactionType: transaction.transactionType,
        transactionDate: dayjs(transaction.transactionDate),
      });

      setSelectedCategories(
        CATEGORIES.filter((category) =>
          transaction.categories?.includes(category.id)
        )
      );
    } catch (error: any) {
      toastService.error(error.message || UNEXPECTED_ERROR);
      router.replace(TRANSACTION_WITH_SEARCH_PARAMS);
    } finally {
      setIsFetchingInitialData(false);
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    router.replace(TRANSACTION_WITH_SEARCH_PARAMS);
  };

  useEffect(() => {
    if (transactionId) {
      (async () => await fetchTransaction(transactionId))();
    }
  }, [transactionId]);

  return (
    <>
      <Modal title="Add Transaction" onClose={handleClose}>
        {isFetchingInitialData && (
          <div className="h-[300px] w-[500px] flex justify-center items-center">
            <Loader />
          </div>
        )}
        {!isFetchingInitialData && (
          <div className="flex flex-col w-[600px]">
            <Box
              component={"form"}
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-8"
            >
              <div className="flex gap-4">
                <TextField
                  required
                  name="description"
                  label="Description"
                  variant="outlined"
                  fullWidth
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    !!formik.errors.description && formik.touched.description
                  }
                  helperText={
                    formik.touched.description ? formik.errors.description : ""
                  }
                />
                <TextField
                  required
                  name="amount"
                  label="Amount"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={!!formik.errors.amount && formik.touched.amount}
                  helperText={formik.touched.amount ? formik.errors.amount : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                />
              </div>

              <div className="flex gap-4">
                <FormControl fullWidth>
                  <InputLabel required id="entry-transaction-type">
                    Transaction Type
                  </InputLabel>
                  <Select
                    name="transactionType"
                    label="Transaction Type"
                    variant="outlined"
                    fullWidth
                    value={formik.values.transactionType}
                    onChange={formik.handleChange}
                    error={
                      !!formik.errors.transactionType &&
                      formik.touched.transactionType
                    }
                    sx={{
                      "& .MuiSelect-select": {
                        padding: "12px",
                      },
                    }}
                    renderValue={(selected) => (
                      <Chip
                        key={selected}
                        label={selected}
                        className={cn(
                          "text-white font-semibold m-0 p-0",
                          selected === TransactionType.Expense
                            ? "bg-red-500"
                            : "bg-green-500"
                        )}
                      />
                    )}
                  >
                    {Object.values(TransactionType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    {formik.touched.transactionType
                      ? formik.errors.transactionType
                      : ""}
                  </FormHelperText>
                </FormControl>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    label="Transaction Date"
                    name="transactionDate"
                    defaultValue={formik.values.transactionDate}
                    value={formik.values.transactionDate}
                    onChange={(date) =>
                      formik.setFieldValue("transactionDate", date)
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        helperText: formik.touched.transactionDate
                          ? formik.errors.transactionDate
                          : "",
                        error:
                          !!formik.errors.transactionDate &&
                          formik.touched.transactionDate,
                      },
                    }}
                  />
                </LocalizationProvider>
              </div>

              <Autocomplete
                multiple={true}
                limitTags={3}
                options={CATEGORIES}
                getOptionLabel={(option) => option.name}
                value={selectedCategories}
                onChange={(
                  event: React.SyntheticEvent,
                  newValues: typeof CATEGORIES
                ) => {
                  formik.setFieldValue(
                    "categories",
                    newValues.map((category) => category.id)
                  );
                  setSelectedCategories(newValues);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category"
                    placeholder="Select categories"
                    name="categories"
                  />
                )}
                renderOption={(props, option) => {
                  const isSelected = selectedCategories?.some(
                    (category) => category.id === option.id
                  );

                  return (
                    <li
                      {...props}
                      className={cn(
                        "flex items-center p-2 px-4 gap-4 cursor-pointer",
                        isSelected ? "bg-blue-100" : "bg-white"
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-full",
                          isSelected ? "bg-blue-200" : "bg-gray-200"
                        )}
                      >
                        {option.icon ? (
                          <option.icon
                            className={cn(
                              "text-gray-700 w-5 h-5",
                              isSelected ? "text-blue-700" : ""
                            )}
                          />
                        ) : null}
                      </div>
                      {option.name}
                    </li>
                  );
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Box component={"div"} key={index}>
                      <Chip
                        label={option.name}
                        icon={<option.icon className="text-gray-700 w-5 h-5" />}
                        {...getTagProps({ index })}
                        className="mr-2"
                      />
                    </Box>
                  ))
                }
              />

              <div className="flex gap-4">
                <Button variant="contained" type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </Box>
          </div>
        )}
      </Modal>
    </>
  );
}
