import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const frequencyEnum = pgEnum('frequency', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
  'one-time',
]);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  pin: text('pin').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const incomes = pgTable('incomes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  amount: integer('amount').notNull(), // Stored in cents
  source: text('source').notNull(),
  date: timestamp('date').notNull(),
  isRecurring: boolean('is_recurring').default(false).notNull(),
  frequency: frequencyEnum('frequency').default('one-time').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  amount: integer('amount').notNull(), // Stored in cents
  category: text('category').notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
