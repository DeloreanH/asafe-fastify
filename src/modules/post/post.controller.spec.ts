import { PostController } from './post.controller';
import { PostService } from './post.service';
import { FastifyRequest, FastifyReply } from 'fastify';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { v4 as uuidv4 } from 'uuid';
import { UpdatePostBody } from './schemas/post-update.schema';
import { CreatePostBody } from './schemas/post-create.schema';

describe('PostController', () => {
    let postController: PostController;
    let postService: jest.Mocked<PostService>;
    let mockRequest: FastifyRequest;
    let mockReply: FastifyReply;

    beforeEach(() => {
        jest.clearAllMocks();

        postService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUid: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<PostService>;

        const container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            postService: asValue(postService),
            postController: asClass(PostController),
        });

        postController = container.resolve<PostController>('postController');

        mockRequest = {} as unknown as FastifyRequest;
        mockReply = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
        } as unknown as FastifyReply;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all user posts', async () => {
            const authorUid = uuidv4();
            const mockPosts = [{
                id: 1,
                authorUid,
                uuid: uuidv4(),
                text: 'Lorem ipsum.',
                createdAt: new Date(),
                updatedAt: new Date(),
            }];

            postService.findAll.mockResolvedValue(mockPosts);

            await postController.findAll(mockRequest as FastifyRequest, mockReply as FastifyReply);

            expect(postService.findAll).toHaveBeenCalledTimes(1);
            expect(mockReply.send).toHaveBeenCalledWith(mockPosts);
        });
    });

    describe('findByUid', () => {
        it('should return a post by uuid', async () => {
            const uuid = uuidv4();
            const authorUid = uuidv4();
            const mockPost = {
                id: 1,
                authorUid,
                uuid,
                text: 'Lorem ipsum.',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            postService.findByUid.mockResolvedValue(mockPost);

            mockRequest = {
                params: { uuid },
            } as FastifyRequest;

            await postController.findByUid(mockRequest as FastifyRequest<{ Params: { uuid: string } }>, mockReply as FastifyReply);

            expect(postService.findByUid).toHaveBeenCalledWith(uuid);
            expect(mockReply.send).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('create', () => {
        it('should create a new post', async () => {
            const authorUid = uuidv4();
            const postData = { text: 'Lorem ipsum.' };
            const uuid = uuidv4();
            const mockPost = {
                id: 1,
                authorUid,
                uuid,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...postData,
            };

            postService.create.mockResolvedValue(mockPost);
            mockRequest.body = postData;
            mockRequest.user = { uuid: authorUid };

            await postController.create(mockRequest as FastifyRequest<{ Body: CreatePostBody }>, mockReply as FastifyReply);

            expect(postService.create).toHaveBeenCalledWith(postData, authorUid);
            expect(mockReply.status).toHaveBeenCalledWith(201);
            expect(mockReply.send).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('update', () => {
        it('should update a post', async () => {
            const authorUid = uuidv4();
            const postData = { text: 'New lorem ipsum.' };
            const uuid = uuidv4();
            const mockPost = {
                id: 1,
                authorUid,
                uuid,
                createdAt: new Date(),
                updatedAt: new Date(),
                ...postData,
            };

            postService.update.mockResolvedValue(mockPost);
            mockRequest.params = { uuid };
            mockRequest.body = postData;
            mockRequest.user = { uuid: authorUid };

            await postController.update(mockRequest as FastifyRequest<{ Params: { uuid: string }; Body: UpdatePostBody }>, mockReply as FastifyReply);

            expect(postService.update).toHaveBeenCalledWith(uuid, postData);
            expect(mockReply.send).toHaveBeenCalledWith(mockPost);
        });
    });

    describe('delete', () => {
        it('should delete a post', async () => {
            const uuid = uuidv4();
            mockRequest.params = { uuid };

            await postController.delete(mockRequest as FastifyRequest<{ Params: { uuid: string } }>, mockReply as FastifyReply);

            expect(postService.delete).toHaveBeenCalledWith(uuid);
            expect(mockReply.status).toHaveBeenCalledWith(204);
            expect(mockReply.send).toHaveBeenCalled();
        });
    });
});
