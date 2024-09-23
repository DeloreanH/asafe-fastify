import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenException } from '../shared/exceptions';
import { roleHook, Permission, rolesPermissions } from './role.hook';
import { Role as PrismaRole } from '@prisma/client';

describe('roleHook', () => {
  let req: FastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    req = {
      user: {
        role: PrismaRole.BASIC,
        permissions: rolesPermissions[PrismaRole.BASIC],
      },
    } as FastifyRequest;

    reply = {} as FastifyReply;
  });

  it('should allow access if user has required permissions', async () => {
    const requiredPermissions = [Permission.WriteOwn];
    const hook = roleHook(requiredPermissions);

    await expect(hook(req, reply)).resolves.not.toThrow();
  });

  it('should throw ForbiddenException if user lacks required permissions', async () => {
    const requiredPermissions = [Permission.WriteAll];
    const hook = roleHook(requiredPermissions);

    await expect(hook(req, reply)).rejects.toThrow(ForbiddenException);
    await expect(hook(req, reply)).rejects.toThrow('Forbidden: Insufficient permissions');
  });

  it('should throw ForbiddenException if user is undefined', async () => {
    req.user = undefined as any;

    const requiredPermissions = [Permission.ReadAll];
    const hook = roleHook(requiredPermissions);

    await expect(hook(req, reply)).rejects.toThrow(ForbiddenException);
    await expect(hook(req, reply)).rejects.toThrow('Forbidden: Insufficient permissions');
  });

  it('should allow access if user is admin and has all permissions', async () => {
    req.user = {
      role: PrismaRole.ADMIN,
      permissions: rolesPermissions[PrismaRole.ADMIN],
    };
    
    const hook = roleHook(rolesPermissions[PrismaRole.ADMIN]);

    await expect(hook(req, reply)).resolves.not.toThrow();
  });
});