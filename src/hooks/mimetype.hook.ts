import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestException } from '../shared/exceptions';

export async function mimeTypeHook(req: FastifyRequest, reply: FastifyReply) {
    const file = await req.file();
    const allowedTypes = ['image/png', 'image/jpeg'];

    if (!file) {
        throw new BadRequestException('No file provided. Only PNG and JPG images are allowed.');
    }

    if (!allowedTypes.includes(file.mimetype)) {
        throw new BadRequestException('Invalid file type. Only PNG and JPG images are allowed.');
    }
}