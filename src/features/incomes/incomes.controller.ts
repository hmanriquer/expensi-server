import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { incomes } from '../../db/schema';
import { catchAsync } from '../../utils/catch-async';
import httpStatus from 'http-status';

export const createIncome = catchAsync(async (req: Request, res: Response) => {
  const { userId, amount, source, date, isRecurring, frequency } = req.body;

  const [newIncome] = await db
    .insert(incomes)
    .values({
      userId,
      amount,
      source,
      date: new Date(date),
      isRecurring: isRecurring || false,
      frequency: frequency || 'one-time',
    })
    .returning();

  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: { income: newIncome },
  });
});

export const getIncomes = catchAsync(async (req: Request, res: Response) => {
  // TODO: Add pagination and filtering
  const allIncomes = await db.select().from(incomes);

  res.status(httpStatus.OK).json({
    status: 'success',
    data: { incomes: allIncomes },
  });
});

export const getIncome = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const incomeId = parseInt(id, 10);

  const [income] = await db
    .select()
    .from(incomes)
    .where(eq(incomes.id, incomeId));

  if (!income) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 'fail',
      message: 'Income not found',
    });
    return;
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: { income },
  });
});

export const updateIncome = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const incomeId = parseInt(id, 10);
  const { amount, source, date, isRecurring, frequency } = req.body;

  const [updatedIncome] = await db
    .update(incomes)
    .set({
      ...(amount && { amount }),
      ...(source && { source }),
      ...(date && { date: new Date(date) }),
      ...(isRecurring !== undefined && { isRecurring }),
      ...(frequency && { frequency }),
    })
    .where(eq(incomes.id, incomeId))
    .returning();

  if (!updatedIncome) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 'fail',
      message: 'Income not found',
    });
    return;
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: { income: updatedIncome },
  });
});

export const deleteIncome = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const incomeId = parseInt(id, 10);

  const [deletedIncome] = await db
    .delete(incomes)
    .where(eq(incomes.id, incomeId))
    .returning();

  if (!deletedIncome) {
    res.status(httpStatus.NOT_FOUND).json({
      status: 'fail',
      message: 'Income not found',
    });
    return;
  }

  res.status(httpStatus.NO_CONTENT).send();
});
