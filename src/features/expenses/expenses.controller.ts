import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { expenses } from '../../db/schema';
import { catchAsync } from '../../utils/catch-async';
import httpStatus from 'http-status';

export const createExpense = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount, category, description, date } = req.body;

  const [newExpense] = await db
    .insert(expenses)
    .values({
      userId,
      amount,
      category,
      description,
      date: new Date(date),
    })
    .returning();

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: { expense: newExpense },
  });
});

export const getExpenses = catchAsync(async (req: Request, res: Response) => {
  // TODO: Add pagination and filtering
  const allExpenses = await db.select().from(expenses);

  res.status(httpStatus.OK).json({
    status: 'success',
    data: { expenses: allExpenses },
  });
});

export const getExpense = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const expenseId = parseInt(id, 10);

  const [expense] = await db
    .select()
    .from(expenses)
    .where(eq(expenses.id, expenseId));

  if (!expense) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 'fail',
      message: 'Expense not found',
    });
    return;
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: { expense },
  });
});

export const updateExpense = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const expenseId = parseInt(id, 10);
  const { amount, category, description, date } = req.body;

  const [updatedExpense] = await db
    .update(expenses)
    .set({
      ...(amount && { amount }),
      ...(category && { category }),
      ...(description && { description }),
      ...(date && { date: new Date(date) }),
    })
    .where(eq(expenses.id, expenseId))
    .returning();

  if (!updatedExpense) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 'fail',
      message: 'Expense not found',
    });
    return;
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: { expense: updatedExpense },
  });
});

export const deleteExpense = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const expenseId = parseInt(id, 10);

  const [deletedExpense] = await db
    .delete(expenses)
    .where(eq(expenses.id, expenseId))
    .returning();

  if (!deletedExpense) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 'fail',
      message: 'Expense not found',
    });
    return;
  }

  res.status(httpStatus.NO_CONTENT).send();
});
