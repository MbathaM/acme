import { checkRole } from './checkRole';
import type { Access } from 'payload/config';

export const admins: Access = ({ req: { user } }) => checkRole(['admin'], user);
