import type { User } from '../../payload-types';

export const checkRole = (
  allRoles: User['roles'] = [],
  user: User | undefined = undefined
): boolean => {
  if (user) {
    return allRoles!.some((role) => user?.roles?.includes(role) ?? false);
  }

  return false;
};
