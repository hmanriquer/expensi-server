import { z } from 'zod';
import { frequencyEnum } from '../../db/schema';

export const createIncomeSchema = z.object({
  body: z.object({
    userId: z.number(),
    amount: z.number().positive(),
    source: z.string().min(1),
    date: z.string().datetime(), // Expect ISO date string
    isRecurring: z.boolean().optional(),
    frequency: z.enum(frequencyEnum.enumValues).optional(),
  }),
});

export const updateIncomeSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    amount: z.number().positive().optional(),
    source: z.string().min(1).optional(),
    date: z.string().datetime().optional(),
    isRecurring: z.boolean().optional(),
    frequency: z.enum(frequencyEnum.enumValues).optional(),
  }),
});

export const deleteIncomeSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
});
