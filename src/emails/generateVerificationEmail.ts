import { PrimaryActionEmailHtml } from './PrimaryActionEmailHtml';

const generateVerificationEmail = async (args): Promise<string> => {
  const { user, token } = args;

  return PrimaryActionEmailHtml({
    headline: 'Verify your account',
    content: `<p>Hi${
      user?.firstname ? ' ' + user?.firstname : ''
    }! Validate your account by clicking the button below.</p>`,
    cta: {
      buttonLabel: 'Verify',
      url: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}&email=${user?.email}`,
      // `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
    },
  });
};

export default generateVerificationEmail;
