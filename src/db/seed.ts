import { db } from '.';
import { users } from './schema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

export const seed = async () => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, 'manrique.hamed1610@gmail.com'));

    if (user.length > 0) return;

    const [createdUser] = await db
      .insert(users)
      .values({
        name: 'Hamed Manrique',
        email: 'manrique.hamed1610@gmail.com',
        password: bcrypt.hashSync('Elegua33!!', 10),
        pin: '1590',
      })
      .returning();

    console.log(createdUser);
  } catch (error) {
    console.log(error);
  }
};

seed();
