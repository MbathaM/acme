import { PrimaryActionEmailHtml } from './PrimaryActionEmailHtml';

const generateForgotPasswordEmail = async ({ token }): Promise<string> => {
  return PrimaryActionEmailHtml({
    headline: 'Locked out?',
    content: '<p>Let&apos;s get you back in.</p>',
    cta: {
      buttonLabel: 'Reset your password',
      url: `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/reset-password?token=${token}`,
    },
  });
};

export default generateForgotPasswordEmail;
