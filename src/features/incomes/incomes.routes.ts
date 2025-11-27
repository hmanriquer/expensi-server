import { Router } from 'express';
import * as incomeController from './incomes.controller';
import { validateRequest } from '../../middlewares/validate-request';
import {
  createIncomeSchema,
  updateIncomeSchema,
  deleteIncomeSchema,
} from './incomes.schema';

const router = Router();

/**
 * @swagger
 * /incomes:
 *   get:
 *     summary: Get all incomes
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of incomes
 *   post:
 *     summary: Create a new income
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Income created
 */
router
  .route('/')
  .get(incomeController.getIncomes)
  .post(validateRequest(createIncomeSchema), incomeController.createIncome);

/**
 * @swagger
 * /incomes/{id}:
 *   get:
 *     summary: Get an income by ID
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income details
 *       404:
 *         description: Income not found
 *   patch:
 *     summary: Update an income
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Income updated
 *   delete:
 *     summary: Delete an income
 *     tags: [Incomes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Income deleted
 */
router
  .route('/:id')
  .get(incomeController.getIncome)
  .patch(validateRequest(updateIncomeSchema), incomeController.updateIncome)
  .delete(validateRequest(deleteIncomeSchema), incomeController.deleteIncome);

export default router;
