import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';

// Mock db
vi.mock('../src/db', () => ({
  db: {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('Expenses Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/expenses', () => {
    it('should return all expenses', async () => {
      const mockExpenses = [
        { id: 1, amount: 50, category: 'Food', date: new Date().toISOString() },
      ];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockResolvedValue(mockExpenses),
      } as any);

      const res = await request(app).get('/api/v1/expenses');

      expect(res.status).toBe(200);
      expect(res.body.data.expenses).toHaveLength(1);
      expect(res.body.data.expenses[0].category).toBe('Food');
    });
  });

  describe('POST /api/v1/expenses', () => {
    it('should create a new expense', async () => {
      const newExpense = {
        userId: 1,
        amount: 50,
        category: 'Food',
        date: new Date('2023-10-01').toISOString(),
      };

      const mockCreatedExpense = {
        id: 1,
        ...newExpense,
        date: new Date(newExpense.date),
      };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockCreatedExpense]),
        }),
      } as any);

      const res = await request(app).post('/api/v1/expenses').send(newExpense);

      expect(res.status).toBe(201);
      expect(res.body.data.expense.category).toBe('Food');
    });

    it('should fail validation with missing fields', async () => {
      const invalidExpense = {
        amount: 50,
        // Missing category and other required fields
      };

      const res = await request(app)
        .post('/api/v1/expenses')
        .send(invalidExpense);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/expenses/:id', () => {
    it('should return an expense by id', async () => {
      const mockExpense = { id: 1, amount: 50, category: 'Food' };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockExpense]),
        }),
      } as any);

      const res = await request(app).get('/api/v1/expenses/1');

      expect(res.status).toBe(200);
      expect(res.body.data.expense.id).toBe(1);
    });

    it('should return 404 if expense not found', async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const res = await request(app).get('/api/v1/expenses/999');

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/expenses/:id', () => {
    it('should update an expense', async () => {
      const updateData = { amount: 60 };
      const mockUpdatedExpense = { id: 1, amount: 60, category: 'Food' };

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUpdatedExpense]),
          }),
        }),
      } as any);

      const res = await request(app)
        .patch('/api/v1/expenses/1')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.data.expense.amount).toBe(60);
    });

    it('should return 404 if expense to update not found', async () => {
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const res = await request(app)
        .patch('/api/v1/expenses/999')
        .send({ amount: 60 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/expenses/:id', () => {
    it('should delete an expense', async () => {
      const mockDeletedExpense = { id: 1 };

      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockDeletedExpense]),
        }),
      } as any);

      const res = await request(app).delete('/api/v1/expenses/1');

      expect(res.status).toBe(204);
    });

    it('should return 404 if expense to delete not found', async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const res = await request(app).delete('/api/v1/expenses/999');

      expect(res.status).toBe(404);
    });
  });
});
