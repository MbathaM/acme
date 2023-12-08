'use client';

import {
  RecoverPasswordSchema,
  TRecoverPasswordSchema,
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

const RecoverPassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRecoverPasswordSchema>({
    resolver: zodResolver(RecoverPasswordSchema),
  });

  const router = useRouter();

  const { mutate, isLoading } = trpc.auth.forgotPassword.useMutation({
    onError: (err) => {
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }

      toast.error('Something went wrong. Please try again.');
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Password reset email sent to ${sentToEmail}.`);
      router.push('/reset-password?to=' + sentToEmail);
    },
  });

  const onSubmit = ({ email }: TRecoverPasswordSchema) => {
    mutate({ email });
  };

  return (
    <div className='container relative flex flex-col items-center justify-center pt-20 lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        <div className='flex flex-col items-center space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Recover Password
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
                  label='Email'
                  variant='bordered'
                  {...register('email')}
                  color={errors.email ? 'danger' : 'success'}
                  errorMessage={errors?.email?.message}
                  placeholder='you@example.com'
                />
              </div>

              <Button isLoading={isLoading} type='submit'>
                Recover Password
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;
