'use client';

import {
  ResetPasswordSchema,
  TResetPasswordSchema,
} from '@/lib/validators/account-credentials-validator';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodError } from 'zod';

interface ResetPasswordProps {
  token: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ token }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const router = useRouter();

  const { mutate, isLoading } = trpc.auth.resetPassword.useMutation({
    onError: (err) => {
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }

      toast.error('Something went wrong. Please try again.');
    },
    onSuccess: () => {
      toast.success('Password reset successfully.');
      // Redirect to the login page or any other desired destination
      router.push('/sign-in');
    },
  });

  const onSubmit = ({ password }: TResetPasswordSchema) => {
    // Call the resetPassword mutation with the token and new password
    mutate({ password, token });
  };

  return (
    <div className='container relative flex flex-col items-center justify-center pt-20 lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Reset Password
          </h1>
          <Link href='/sign-in'>
            <Button variant='light' className='gap-1.5'>
              Back to Sign In
            </Button>
          </Link>
        </div>

        <div className='grid gap-6'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-2'>
              <div className='grid gap-1 py-2'>
                <Input
                  isRequired
                  autoFocus
                  type='password'
                  label='New Password'
                  variant='bordered'
                  {...register('password')}
                  color={errors.password ? 'danger' : 'success'}
                  errorMessage={errors?.password?.message}
                  placeholder='Enter your new password'
                />
              </div>

              <div className='grid gap-1 py-2'>
                <Input
                  isRequired
                  type='password'
                  label='Confirm Password'
                  variant='bordered'
                  {...register('passwordConfirmation')}
                  color={errors.passwordConfirmation ? 'danger' : 'success'}
                  errorMessage={errors?.passwordConfirmation?.message}
                  placeholder='Confirm your new password'
                />
              </div>

              <Button type='submit' disabled={isLoading} isLoading={isLoading}>
                Reset Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
