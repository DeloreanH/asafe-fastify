import { FastifyRequest, FastifyReply } from 'fastify';
import { BadRequestException } from '../shared/exceptions';
import { mimeTypeHook } from './mimetype.hook'; // Adjust the import based on your file structure

describe('mimeTypeHook', () => {
  let req: FastifyRequest;
  let reply: FastifyReply;

  beforeEach(() => {
    jest.clearAllMocks();
    req = { file: jest.fn() } as unknown as FastifyRequest;
    reply = {} as FastifyReply;
  });

  it('should not throw an error for a valid PNG file type', async () => {
    (req.file as jest.Mock).mockResolvedValue({ mimetype: 'image/png' });

    await expect(mimeTypeHook(req, reply)).resolves.not.toThrow();
  });

  it('should not throw an error for a valid JPG file type', async () => {
    (req.file as jest.Mock).mockResolvedValue({ mimetype: 'image/jpeg' });

    await expect(mimeTypeHook(req, reply)).resolves.not.toThrow();
  });

  it('should throw BadRequestException for an invalid file type', async () => {
    (req.file as jest.Mock).mockResolvedValue({ mimetype: 'image/gif' });

    await expect(mimeTypeHook(req, reply)).rejects.toThrow(BadRequestException);
    await expect(mimeTypeHook(req, reply)).rejects.toThrow('Invalid file type. Only PNG and JPG images are allowed.');
  });

  it('should throw BadRequestException if no file is provided', async () => {
    (req.file as jest.Mock).mockResolvedValue(null);

    await expect(mimeTypeHook(req, reply)).rejects.toThrow(BadRequestException);
    await expect(mimeTypeHook(req, reply)).rejects.toThrow('No file provided. Only PNG and JPG images are allowed.');
  });
});