import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { routes } from '@/config/routes';
import { loginSchema } from '@/features/admin-auth/schema';
import { prisma } from '@/lib/prisma';

// Auth.js Credentials + JWT sessions, no adapter tables (D-03).
export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt', maxAge: 60 * 60 * 12 },
  pages: { signIn: routes.admin.login },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          select: {
            id: true,
            email: true,
            name: true,
            status: true,
            passwordHash: true,
          },
        });
        if (!user?.passwordHash || user.status !== 'active') return null;
        if (!(await bcrypt.compare(parsed.data.password, user.passwordHash)))
          return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
