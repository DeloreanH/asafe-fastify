import { FastifyRequest, FastifyReply } from 'fastify';
import { UnauthorizedException } from '../shared/exceptions';
import { authHook } from './auth.hook';

describe('authHook', () => {
    let req: FastifyRequest;
    let reply: FastifyReply;

    beforeEach(() => {
        reply = {} as FastifyReply;
    });

    it('should call jwtVerify and populate req.user on success', async () => {
        req = {
            jwtVerify: jest.fn().mockImplementation(async () => {
                req.user = { id: 1, role: 'regular' };
            }),
        } as unknown as FastifyRequest;

        await authHook(req, reply);

        expect(req.jwtVerify).toHaveBeenCalled();
        expect(req.user).toEqual({ id: 1, role: 'regular' });
    });

    it('should throw UnauthorizedException on jwtVerify failure', async () => {
        req = {
            jwtVerify: jest.fn().mockRejectedValue(new Error('Invalid token')),
        } as unknown as FastifyRequest;

        await expect(authHook(req, reply)).rejects.toThrow(UnauthorizedException);
    });
});
