import { z } from 'zod';

export const AuthCredentialsValidator = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;

export const RecoverPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export type TRecoverPasswordSchema = z.infer<typeof RecoverPasswordSchema>;

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
  passwordConfirmation: z.string().min(8, {
    message: 'Password must be at least 8 characters long.',
  }),
});

export type TResetPasswordSchema = z.infer<typeof ResetPasswordSchema>;
