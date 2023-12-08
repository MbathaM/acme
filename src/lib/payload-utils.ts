import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { headers } from 'next/headers';
import { NextRequest } from 'next/server';
import { User } from '../payload-types';

export const getServerSideUser = async (
  cookies: NextRequest['cookies'] | ReadonlyRequestCookies
) => {
  const headersList = headers();
  const domain = headersList.get('host') as string;

  const token = cookies.get('payload-token')?.value;

  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    // `${domain}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  );

  const { user } = (await meRes.json()) as {
    user: User | null;
  };

  return { user };
};
