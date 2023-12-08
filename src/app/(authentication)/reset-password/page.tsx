import Image from 'next/image';
import ResetPassword from './reset-password';

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const ResetPasswordEmailPage = ({ searchParams }: PageProps) => {
  const token = searchParams.token;
  const toEmail = searchParams.to;

  return (
    <div className='container relative flex flex-col items-center justify-center pt-20 lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]'>
        {token && typeof token === 'string' ? (
          <div className='grid gap-6'>
            {/* Include feedback message for successful email reset */}
            <ResetPassword token={token}/>
          </div>
        ) : (
          <div className='flex h-full flex-col items-center justify-center space-y-1'>
            <div className='text-muted-foreground relative mb-4 h-60 w-60'>
              <Image
                src='/calf-email-sent.png'
                fill
                alt='hippo email sent image'
              />
            </div>

            <h3 className='text-2xl font-semibold'>Check your email</h3>

            {toEmail ? (
              <p className='text-muted-foreground text-center'>
                We&apos;ve sent a reset link to{' '}
                <span className='font-semibold'>{toEmail}</span>.
              </p>
            ) : (
              <p className='text-muted-foreground text-center'>
                We&apos;ve sent a reset link to your email.
              </p>
            )}

            {/* Additional feedback messages can be added here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordEmailPage;
