import Modal from "@/components/Modal";
import { TransactionType } from "@/enums/TransactionType";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { AddTransactionFormaValues } from "@/types/transaction";
import { v4 as uuidV4 } from "uuid";
import { createNewTransaction } from "@/services/transaction.action";

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

export default function TransactionEntry() {
  const router = useRouter();
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
      console.log(values);
      await createNewTransaction({
        ...values,
        amount: values.amount as number,
        transactionDate: values.transactionDate!.toISOString(),
      });
      router.replace("/transactions?refetch=true");
    },
  });

  const onCancel = () => {
    router.replace("/transactions");
  };

  return (
    <Modal title="Add Transaction">
      <div className="flex flex-col w-[600px]">
        <Box
          component={"form"}
          onSubmit={formik.handleSubmit}
          className="flex flex-col gap-8"
        >
          <TextField
            name="description"
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={formik.values.description}
            onChange={formik.handleChange}
            error={!!formik.errors.description && formik.touched.description}
            helperText={
              formik.touched.description ? formik.errors.description : ""
            }
            className="m-0 p-0"
          />

          <div className="flex gap-4 m-0 p-0">
            <TextField
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
            />

            <TextField
              select
              name="transactionType"
              label="Transaction Type"
              variant="outlined"
              fullWidth
              margin="normal"
              value={formik.values.transactionType}
              onChange={formik.handleChange}
              error={
                !!formik.errors.transactionType &&
                formik.touched.transactionType
              }
              helperText={
                formik.touched.transactionType
                  ? formik.errors.transactionType
                  : ""
              }
              className="m-0 p-0"
            >
              {Object.values(TransactionType).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Transaction Date"
              name="transactionDate"
              defaultValue={formik.values.transactionDate}
              value={formik.values.transactionDate}
              onChange={(date) => formik.setFieldValue("transactionDate", date)}
              slotProps={{
                textField: {
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
            <Button variant="contained" type="submit">
              Save
            </Button>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Box>
      </div>
    </Modal>
  );
}
