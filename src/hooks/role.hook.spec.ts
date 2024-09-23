import { FastifyRequest, FastifyReply } from 'fastify';
import { ForbiddenException } from '../shared/exceptions';
import { roleHook, Role, Permission, rolesPermissions } from './role.hook';

describe('roleHook', () => {
  let req: FastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    req = {
      user: {
        role: Role.Regular,
        permissions: rolesPermissions[Role.Regular],
      },
    } as FastifyRequest;

    reply = {} as FastifyReply;
  });

  it('should allow access if user has required permissions', async () => {
    const requiredPermissions = [Permission.ReadAll];
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
      role: Role.Admin,
      permissions: rolesPermissions[Role.Admin],
    };

    const requiredPermissions = [Permission.ReadAll, Permission.WriteAll, Permission.DeleteAll];
    const hook = roleHook(requiredPermissions);

    await expect(hook(req, reply)).resolves.not.toThrow();
  });
});