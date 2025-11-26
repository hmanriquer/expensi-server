import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    userId: z.number(),
    amount: z.number().positive(),
    category: z.string().min(1),
    description: z.string().optional(),
    date: z.string().datetime(), // Expect ISO date string
  }),
});

export const updateExpenseSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    amount: z.number().positive().optional(),
    category: z.string().min(1).optional(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
  }),
});

export const deleteExpenseSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
});
