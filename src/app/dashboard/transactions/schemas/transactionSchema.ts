import { z } from "zod";

export const transactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Transaction title is required.")
    .max(150, "Title cannot exceed 150 characters."),

  amount: z.number().positive("Amount must be greater than zero."),

  type: z.enum(["income", "expense"]),

  category_id: z.number().int().positive("Please select a category."),

  transaction_date: z.string().min(1, "Please select a date."),

  notes: z.string(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
