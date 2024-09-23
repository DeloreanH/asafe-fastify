
import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenException } from '../shared/exceptions';

export enum Role {
  Admin = 'admin',
  Regular = 'regular',
}

export enum Permission {
  ReadAll = 'read:all',
  WriteAll = 'write:all',
  DeleteAll = 'delete:all',
  ReadOwn = 'read:own',
}

// TODO: Consider storing permissions in a database for dynamic access control
// This would allow you to update permissions without code changes
export const rolesPermissions: Record<Role, string[]> = {
  [Role.Admin]: [Permission.ReadAll, Permission.WriteAll, Permission.DeleteAll],
  [Role.Regular]: [Permission.ReadAll],
};

export function roleHook(requiredPermissions: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as { role: Role; permissions: string[] };
    const userPermissions = rolesPermissions[user?.role] || [];
    const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));

    if (!user || !hasPermission) {
      throw new ForbiddenException('Forbidden: Insufficient permissions');
    }
  };
}