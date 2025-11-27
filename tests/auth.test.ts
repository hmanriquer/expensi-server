import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import { db } from '../src/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock dependencies
vi.mock('../src/db', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn(),
  },
}));

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn(),
  },
}));

describe('Auth Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        pin: '1234',
      };

      // Mock db.select to return empty array (no existing user)
      (db.select as any).mockReturnValue([]); // This might need adjustment based on chain
      // Actually the chain is select().from().where().
      // We need to mock the chain execution.
      // Let's refine the mock structure.
      const mockSelect = vi.fn().mockReturnThis();
      const mockFrom = vi.fn().mockReturnThis();
      const mockWhere = vi.fn().mockReturnValue([]); // Return empty array for existing user check

      (db.select as any).mockImplementation(mockSelect);
      (db.select().from as any).mockImplementation(mockFrom);
      (db.select().from().where as any).mockImplementation(mockWhere);

      // Re-mock for the specific chain structure if needed, but let's try a simpler approach for the chain
      // The controller does: await db.select().from(users).where(eq(users.email, email));
      // So db.select() returns an object with .from(), which returns an object with .where() which returns the promise/result.

      const mockWhereReturn = [];
      const mockReturningReturn = [{ id: 1, ...newUser }];

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockWhereReturn),
        }),
      } as any);

      vi.mocked(db.insert).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue(mockReturningReturn),
        }),
      } as any);

      vi.mocked(bcrypt.hash).mockResolvedValue('hashed_secret' as never);
      vi.mocked(jwt.sign).mockReturnValue('mock_token' as never);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.token).toBe('mock_token');
      expect(res.body.data.user.email).toBe(newUser.email);
    });

    it('should return 400 if email is already in use', async () => {
      const newUser = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123',
        pin: '1234',
      };

      // Mock existing user found
      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([{ id: 1, email: newUser.email }]),
        }),
      } as any);

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Email already in use');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: credentials.email,
        password: 'hashed_password',
      };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockUser]),
        }),
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      vi.mocked(jwt.sign).mockReturnValue('mock_token' as never);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials);

      expect(res.status).toBe(200);
      expect(res.body.token).toBe('mock_token');
    });

    it('should return 401 with incorrect password', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrong_password',
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: credentials.email,
        password: 'hashed_password',
      };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([mockUser]),
        }),
      } as any);

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password');
    });

    it('should return 401 if user not found', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      } as any);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Incorrect email or password');
    });
  });
});
