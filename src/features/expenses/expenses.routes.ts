import { Router } from 'express';
import * as expenseController from './expenses.controller';
import { validateRequest } from '../../middlewares/validate-request';
import {
  createExpenseSchema,
  updateExpenseSchema,
  deleteExpenseSchema,
} from './expenses.schema';

const router = Router();

router
  .route('/')
  .get(expenseController.getExpenses)
  .post(validateRequest(createExpenseSchema), expenseController.createExpense);

router
  .route('/:id')
  .get(expenseController.getExpense)
  .patch(validateRequest(updateExpenseSchema), expenseController.updateExpense)
  .delete(
    validateRequest(deleteExpenseSchema),
    expenseController.deleteExpense
  );

export default router;
