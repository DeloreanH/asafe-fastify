
import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenException } from '../shared/exceptions';
import { Role as PrismaRole } from '@prisma/client';

export enum Permission {
  ReadAll = 'read:all',
  WriteAll = 'write:all',
  DeleteAll = 'delete:all',
  ReadOwn = 'read:own',
  WriteOwn = 'write:own',
  DeleteOwn = 'delete:own',
}

// TODO: Consider storing permissions in a database for dynamic access control
// This would allow you to update permissions without code changes
export const rolesPermissions: Record<PrismaRole, string[]> = {
  [PrismaRole.ADMIN]: [Permission.ReadAll, Permission.WriteAll, Permission.DeleteAll],
  [PrismaRole.BASIC]: [Permission.ReadOwn, Permission.WriteOwn, Permission.DeleteOwn],
};

export function roleHook(requiredPermissions: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = req.user as { role: PrismaRole; permissions: string[] };
    const userPermissions = rolesPermissions[user?.role] || [];
    const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
    if (!user || !hasPermission) {
      throw new ForbiddenException('Forbidden: Insufficient permissions');
    }
  };
}