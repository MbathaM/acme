import type { User } from '../../payload-types';
import type { FieldHook } from 'payload/types';

// Ensure there is always a `user` role
// Do not let non-admins change roles
export const protectRoles: FieldHook<User & { id: string }> = async ({
  req,
  data,
}) => {
  const isAdmin = req.user?.roles.includes('admin');

  if (!isAdmin) {
    return ['user'];
  }

  const userRoles = new Set<string>(data?.roles || []);
  userRoles.add('user');

  // Convert the Set back to an array and return
  return Array.from(userRoles);
};
