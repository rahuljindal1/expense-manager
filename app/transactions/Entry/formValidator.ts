import * as yup from "yup";

import { TransactionType } from "@/enums/TransactionType";

export const validationSchema = yup.object().shape({
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
  categories: yup.array().of(yup.number()).default([]).optional(),
});
