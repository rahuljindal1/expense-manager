import Modal from "@/components/Modal";
import { TransactionType } from "@/enums/TransactionType";
import {
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
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { AddTransactionFormaValues } from "@/types/transaction";
import { v4 as uuidV4 } from "uuid";
import {
  createNewTransaction,
  editTransaction,
  getTransactionById,
} from "@/services/transaction.action";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { cn } from "@/lib/utils";

const schema = yup.object().shape({
  description: yup.string().required("Description is required"),
  amount: yup
    .number()
    .positive("Amount must be greater than 0")
    .required("Amount is required"),
  transactionType: yup
    .string()
    .oneOf(Object.values(TransactionType))
    .required("Transaction Type is required"),
  transactionDate: yup.date().required("Transaction Date is required"),
});

export default function TransactionEntry({
  transactionId,
}: {
  transactionId?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(false);

  const formik = useFormik<AddTransactionFormaValues>({
    initialValues: {
      id: uuidV4(),
      description: "",
      amount: undefined,
      transactionType: TransactionType.Expense,
      transactionDate: dayjs(),
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (transactionId) {
          await editTransaction({
            ...values,
            amount: values.amount as number,
            transactionDate: values.transactionDate!.toISOString(),
          });
          toast.success("Transaction edited successfully");
        } else {
          await createNewTransaction({
            ...values,
            amount: values.amount as number,
            transactionDate: values.transactionDate!.toISOString(),
          });
          toast.success("Transaction added successfully");
        }
        router.replace("/transactions?refetch=true");
      } catch (error: any) {
        toast.error(error.message || "Some unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const onCancel = () => {
    router.replace("/transactions");
  };

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
    } catch (error: any) {
      toast.error(error.message || "some unexpected error occurred");
      router.replace("/transactions");
    } finally {
      setIsFetchingInitialData(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      (async () => await fetchTransaction(transactionId))();
    }
  }, [transactionId]);

  return (
    <>
      <Modal title="Add Transaction">
        {isFetchingInitialData && (
          <div className="h-[300px] w-[500px] flex justify-center items-center">
            <ClipLoader />
          </div>
        )}
        {!isFetchingInitialData && (
          <div className="flex flex-col w-[600px]">
            <Box
              component={"form"}
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-8"
            >
              <TextField
                required
                name="description"
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  !!formik.errors.description && formik.touched.description
                }
                helperText={
                  formik.touched.description ? formik.errors.description : ""
                }
                className="m-0 p-0"
              />

              <div className="flex gap-4 m-0 p-0">
                <TextField
                  required
                  name="amount"
                  label="Amount"
                  type="number"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  error={!!formik.errors.amount && formik.touched.amount}
                  helperText={formik.touched.amount ? formik.errors.amount : ""}
                  className="m-0 p-0"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">₹</InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: Boolean(formik.values.amount) }}
                />

                <FormControl fullWidth>
                  <InputLabel required id="entry-transaction-type">
                    TransactionType
                  </InputLabel>
                  <Select
                    name="transactionType"
                    label="transactionType"
                    variant="outlined"
                    fullWidth
                    value={formik.values.transactionType}
                    onChange={formik.handleChange}
                    error={
                      !!formik.errors.transactionType &&
                      formik.touched.transactionType
                    }
                    renderValue={(selected) => (
                      <Chip
                        key={selected}
                        label={selected}
                        className={cn(
                          "text-white font-semibold",
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
              </div>

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

              <div className="flex gap-4">
                <Button variant="contained" type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save"}
                </Button>
                <Button
                  variant="outlined"
                  onClick={onCancel}
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
