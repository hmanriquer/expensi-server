import { Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db';
import { users } from '../../db/schema';
import { catchAsync } from '../../utils/catch-async';
import httpStatus from 'http-status';

const signToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  } as jwt.SignOptions);
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password, pin } = req.body;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser.length > 0) {
    res.status(httpStatus.BAD_REQUEST).json({
      status: 'fail',
      message: 'Email already in use',
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const hashedPin = await bcrypt.hash(pin, 12);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      pin: hashedPin,
    })
    .returning();

  const token = signToken(newUser.id);

  res.status(httpStatus.CREATED).json({
    status: 'success',
    token,
    data: {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    },
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(httpStatus.UNAUTHORIZED).json({
      status: 'fail',
      message: 'Incorrect email or password',
    });
    return;
  }

  const token = signToken(user.id);

  res.status(httpStatus.OK).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    },
  });
});
