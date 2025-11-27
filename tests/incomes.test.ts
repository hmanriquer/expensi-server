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

describe('Incomes Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/v1/incomes', () => {
    it('should return all incomes', async () => {
      const mockIncomes = [
        {
          id: 1,
          amount: 100,
          source: 'Salary',
          date: new Date().toISOString(),
        },
      ];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockResolvedValue(mockIncomes),
      } as any);

      const res = await request(app).get('/api/v1/incomes');

      expect(res.status).toBe(200);
      expect(res.body.data.incomes).toHaveLength(1);
      expect(res.body.data.incomes[0].source).toBe('Salary');
    });
  });

  describe('POST /api/v1/incomes', () => {
    it('should create a new income', async () => {
      const newIncome = {
        userId: 1,
        amount: 500,
        source: 'Freelance',
        date: new Date('2023-10-01').toISOString(),
        isRecurring: false,
        frequency: 'one-time',
      };

      const mockCreatedIncome = {
        id: 1,
        ...newIncome,
        date: new Date(newIncome.date),
      };

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockCreatedIncome]),
        }),
      } as any);

      const res = await request(app).post('/api/v1/incomes').send(newIncome);

      expect(res.status).toBe(201);
      expect(res.body.data.income.source).toBe('Freelance');
    });

    it('should fail validation with missing fields', async () => {
      const invalidIncome = {
        amount: 500,
        // Missing source and other required fields
      };

      const res = await request(app)
        .post('/api/v1/incomes')
        .send(invalidIncome);

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/v1/incomes/:id', () => {
    it('should return an income by id', async () => {
      const mockIncome = { id: 1, amount: 100, source: 'Salary' };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockIncome]),
        }),
      } as any);

      const res = await request(app).get('/api/v1/incomes/1');

      expect(res.status).toBe(200);
      expect(res.body.data.income.id).toBe(1);
    });

    it('should return 404 if income not found', async () => {
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const res = await request(app).get('/api/v1/incomes/999');

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/v1/incomes/:id', () => {
    it('should update an income', async () => {
      const updateData = { amount: 600 };
      const mockUpdatedIncome = { id: 1, amount: 600, source: 'Salary' };

      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([mockUpdatedIncome]),
          }),
        }),
      } as any);

      const res = await request(app)
        .patch('/api/v1/incomes/1')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.data.income.amount).toBe(600);
    });

    it('should return 404 if income to update not found', async () => {
      vi.mocked(db.update).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            returning: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as any);

      const res = await request(app)
        .patch('/api/v1/incomes/999')
        .send({ amount: 600 });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/v1/incomes/:id', () => {
    it('should delete an income', async () => {
      const mockDeletedIncome = { id: 1 };

      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockDeletedIncome]),
        }),
      } as any);

      const res = await request(app).delete('/api/v1/incomes/1');

      expect(res.status).toBe(204);
    });

    it('should return 404 if income to delete not found', async () => {
      vi.mocked(db.delete).mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const res = await request(app).delete('/api/v1/incomes/999');

      expect(res.status).toBe(404);
    });
  });
});
