'use client';

import { ForwardArrow, LockIcon, Logo, MailIcon } from '@/components/icons';
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from '@/lib/validators/account-credentials-validator';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@nextui-org/button';
import { Input } from '@nextui-org/input';
import { button as buttonStyles } from '@nextui-org/theme';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { ZodError } from 'zod';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const router = useRouter();

  const { mutate, isLoading } = trpc.auth.createPayloadUser.useMutation({
    onError: (err) => {
      if (err.data?.code === 'CONFLICT') {
        toast.error('This email is already in use. Sign in instead?');
        return;
      }

      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }

      toast.error('Something went wrong. Please try again.');
    },
    onSuccess: ({ sentToEmail }) => {
      toast.success(`Verification email sent to ${sentToEmail}.`);
      router.push('/verify-email?to=' + sentToEmail);
    },
  });

  const onSubmit = ({ email, password }: TAuthCredentialsValidator) => {
    mutate({ email, password });
  };

  return (
    <>
      <div className='container relative flex flex-col items-center justify-center pt-20 lg:px-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
          <div className='flex flex-col items-center space-y-2 text-center'>
            {/* Use NextUI Logo component */}
            <Logo className='h-20 w-20' />
            <h1 className='text-2xl font-semibold tracking-tight'>
              Create an account
            </h1>

            <Link
              // Use NextUI Button component
              className={buttonStyles({
                variant: 'light',
                className: 'gap-1.5',
              })}
              href='/sign-in'
            >
              Already have an account? Sign-in
              {/* Use NextUI ForwardArrow component */}
              <ForwardArrow className='h-4 w-4' />
            </Link>
          </div>

          <div className='grid gap-6'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='grid gap-2'>
                <div className='grid gap-1 py-2'>
                  {/* Use NextUI Input component with icons */}
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
                  {/* Use NextUI Input component with icons */}
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

                {/* Use NextUI Button component */}
                <Button
                  type='submit'
                  disabled={isLoading}
                  isLoading={isLoading}
                >
                  Sign up
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
