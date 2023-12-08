'use client';

import { ForwardArrow, LockIcon, Logo, MailIcon } from '@/components/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org//button';
import { Input } from '@nextui-org/input';
import { Link } from '@nextui-org/link';
import { button as buttonStyles } from '@nextui-org/theme';
import { useForm } from 'react-hook-form';

import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validator';
import { trpc } from '@/trpc/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

const Page = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const isAdmin = searchParams.get('as') === 'admin';
  const origin = searchParams.get('origin');

  const continueAsAdmin = () => {
    router.push('?as=admin');
  };

  const continueAsBuyer = () => {
    router.replace('/sign-in', undefined);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const { mutate: signIn, isLoading } = trpc.auth.signIn.useMutation({
    onSuccess: async () => {
      toast.success('Signed in successfully');

      router.refresh();

      if (origin) {
        router.push(`/${origin}`);
        return;
      }

      if (isAdmin) {
        router.push('/admin');
        return;
      }

      router.push('/');
    },
    onError: (err) => {
      if (err.data?.code === 'UNAUTHORIZED') {
        toast.error('Invalid email or password.');
      }
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    signIn({ email, password });
  };

  return (
    <>
      <div className='container relative flex flex-col items-center justify-center pt-20 lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            <Logo className='h-20 w-20' />
            <h1 className='text-2xl font-semibold tracking-tight'>
              Sign in to your {isAdmin ? 'admin' : ''} account
            </h1>

            <Link
              // Use NextUI Button component
              className={buttonStyles({
                variant: 'light',
                className: 'gap-1.5',
              })}
              href='/sign-up'
            >
              Don&apos;t have an account?
              <ForwardArrow className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                  <Input
                    isRequired
                    autoFocus
                    endContent={
                      <MailIcon className='pointer-events-none flex-shrink-0 text-2xl text-default-400' />
                    }
                    label='Email'
                    variant='bordered'
                    {...register('email')}
                    color={errors.email ? 'danger' : 'success'}
                    errorMessage={errors?.email?.message}
                    placeholder='you@example.com'
                  />
                </div>

                <div className='grid gap-1 py-2'>
                  <Input
                    endContent={
                      <LockIcon className='pointer-events-none flex-shrink-0 text-2xl text-default-400' />
                    }
                    label='Password'
                    isRequired
                    type='password'
                    variant='bordered'
                    color={errors.password ? 'danger' : 'success'}
                    errorMessage={errors?.password?.message}
                    placeholder='Password'
                    {...register('password')}
                  />
                </div>

                <Button
                  type='submit'
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Sign in
                </Button>
              </div>
            </form>

            <div className='relative'>
              <div
                aria-hidden='true'
                className='absolute inset-0 flex items-center'
              >
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='text-muted-foreground bg-background px-2'>
                  or
                </span>
              </div>
            </div>

            {isAdmin ? (
              <Button
                onClick={continueAsBuyer}
                variant='flat'
                disabled={isLoading}
              >
                Continue as customer
              </Button>
            ) : (
              <Button
                onClick={continueAsAdmin}
                variant='flat'
                disabled={isLoading}
              >
                Continue as admin
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
