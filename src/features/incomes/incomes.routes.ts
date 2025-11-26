import { Router } from 'express';
import * as incomeController from './incomes.controller';
import { validateRequest } from '../../middlewares/validate-request';
import {
  createIncomeSchema,
  updateIncomeSchema,
  deleteIncomeSchema,
} from './incomes.schema';

const router = Router();

router
  .route('/')
  .get(incomeController.getIncomes)
  .post(validateRequest(createIncomeSchema), incomeController.createIncome);

router
  .route('/:id')
  .get(incomeController.getIncome)
  .patch(validateRequest(updateIncomeSchema), incomeController.updateIncome)
  .delete(validateRequest(deleteIncomeSchema), incomeController.deleteIncome);

export default router;
