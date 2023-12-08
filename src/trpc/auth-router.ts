import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { getPayloadClient } from '../get-payload';
import { AuthCredentialsValidator } from '../lib/validators/account-credentials-validator';
import { publicProcedure, router } from './trpc';

export const authRouter = router({
  createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input }) => {
      const { email, password } = input;
      const payload = await getPayloadClient();

      // check if user already exists
      const { docs: users } = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length !== 0) throw new TRPCError({ code: 'CONFLICT' });

      await payload.create({
        collection: 'users',
        data: {
          email,
          password,
          roles: ['user'],
        },
      });

      return { success: true, sentToEmail: email };
    }),

  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;

      const payload = await getPayloadClient();

      const isVerified = await payload.verifyEmail({
        collection: 'users',
        token,
      });

      if (!isVerified) throw new TRPCError({ code: 'UNAUTHORIZED' });

      return { success: true };
    }),

  signIn: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { res } = ctx;

      const payload = await getPayloadClient();

      try {
        await payload.login({
          collection: 'users',
          data: {
            email,
            password,
          },
          res,
        });

        return { success: true };
      } catch (err) {
        throw new TRPCError({ code: 'UNAUTHORIZED' });
      }
    }),

  forgotPassword: publicProcedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      const { email } = input;
      const payload = await getPayloadClient();

      // Check if the user exists
      const { docs: users } = await payload.find({
        collection: 'users',
        where: {
          email: {
            equals: email,
          },
        },
      });

      if (users.length === 0) throw new TRPCError({ code: 'NOT_FOUND' });

      await payload.forgotPassword({
        collection: 'users',
        data: {
          email,
        },
      });

      return { success: true, sentToEmail: email };
    }),

  resetPassword: publicProcedure
    .input(z.object({ password: z.string(), token: z.string() }))
    .mutation(async ({ input }) => {
      const { password, token } = input;
      const payload = await getPayloadClient();

      // Find the user with the provided reset token
      const { docs: users } = await payload.find({
        collection: 'users',
        where: {
          resetPasswordToken: {
            equals: token,
          },
        },
      });

      if (users.length === 0) throw new TRPCError({ code: 'NOT_FOUND' });

      // Update the user's password and reset token
      await payload.resetPassword({
        collection: 'users',
        data: {
          password,
          token,
        },
        overrideAccess: true,
      });

      return { success: true };
    }),
});
