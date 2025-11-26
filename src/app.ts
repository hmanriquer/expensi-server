import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './features/auth/auth.routes';
import incomesRouter from './features/incomes/incomes.routes';
import expensesRouter from './features/expenses/expenses.routes';
import { errorHandler } from './middlewares/error-handler';
import httpStatus from 'http-status';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/incomes', incomesRouter);
app.use('/api/v1/expenses', expensesRouter);

// Health check
app.get('/', (_, res) => {
  res
    .status(httpStatus.OK)
    .json({ status: 'ok', message: 'Expendi API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(httpStatus.NOT_FOUND).json({
    status: 'fail',
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

export default app;
