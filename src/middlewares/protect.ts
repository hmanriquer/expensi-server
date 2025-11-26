import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import httpStatus from 'http-status';

interface JwtPayload {
  id: number;
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: 'fail',
      message: 'You are not logged in! Please log in to get access.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload;

    const [currentUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.id));

    if (!currentUser) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        status: 'fail',
        message: 'The user belonging to this token does no longer exist.',
      });
    }

    req.user = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
    };
    next();
  } catch (error) {
    return res.status(httpStatus.UNAUTHORIZED).json({
      status: 'fail',
      message: 'Invalid token. Please log in again.',
    });
  }
};
