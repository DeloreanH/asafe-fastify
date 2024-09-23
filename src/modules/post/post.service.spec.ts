import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { createContainer, asValue, asClass, InjectionMode } from 'awilix';
import { v4 as uuidv4 } from 'uuid';
import { Post } from '@prisma/client';

describe('PostService', () => {
    let postService: PostService;
    let postRepository: jest.Mocked<PostRepository>;

    beforeEach(() => {
        jest.clearAllMocks();

        postRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findByUid: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<PostRepository>;

        const container = createContainer({
            injectionMode: InjectionMode.CLASSIC,
        });

        container.register({
            postRepository: asValue(postRepository),
            postService: asClass(PostService),
        });

        postService = container.resolve<PostService>('postService');
    });

    describe('findAll', () => {
        it('should return all posts', async () => {
            const authorUid = uuidv4();
            const mockPosts: Post[] = [{ id: 1, uuid: uuidv4(), text: 'Lorem ipsum.', authorUid } as Post];
            postRepository.findAll.mockResolvedValue(mockPosts);

            const result = await postService.findAll();

            expect(result).toEqual(mockPosts);
            expect(postRepository.findAll).toHaveBeenCalledTimes(1);
        });
    });

    describe('findById', () => {
        it('should return a post by uuid', async () => {
            const uuid = uuidv4();
            const authorUid = uuidv4();
            const mockPost = { id: 1, uuid: uuidv4(), text: 'Lorem ipsum.', authorUid } as Post;
            postRepository.findByUid.mockResolvedValue(mockPost);

            const result = await postService.findByUid(uuid);

            expect(result).toEqual(mockPost);
            expect(postRepository.findByUid).toHaveBeenCalledWith(uuid);
        });

        it('should return null if post not found', async () => {
            const uuid = uuidv4();
            postRepository.findByUid.mockResolvedValue(null);

            const result = await postService.findByUid(uuid);

            expect(result).toBeNull();
            expect(postRepository.findByUid).toHaveBeenCalledWith(uuid);
        });
    });

    describe('create', () => {
        it('should create a new post', async () => {
            const authorUid = uuidv4();
            const uuid = uuidv4();
            const postData = {
                text: 'Lorem ipsum.',
            };

            postRepository.create.mockResolvedValueOnce({ id: 1, authorUid, uuid, ...postData } as Post);

            const result = await postService.create(postData, authorUid);

            expect(result).toEqual({ id: 1, authorUid, uuid, ...postData });
            expect(postRepository.create).toHaveBeenCalledWith(postData, authorUid);
        });
    });

    describe('update', () => {
        it('should update a post', async () => {
            const uuid = uuidv4();
            const postData = { text: 'New lorem ipsum.' };
            postRepository.update.mockResolvedValue({ id: 1, uuid, ...postData } as Post);

            const result = await postService.update(uuid, postData);

            expect(result).toEqual({ id: 1, uuid, ...postData });
            expect(postRepository.update).toHaveBeenCalledWith(uuid, postData);
        });
    });

    describe('delete', () => {
        it('should delete a post', async () => {
            const authorUid = uuidv4();
            const uuid = uuidv4();
            const postToDelete = { id: 1, authorUid, uuid, text: 'Lorem ipsum.' } as Post;
            postRepository.delete.mockResolvedValue(postToDelete);

            const result = await postService.delete(uuid);

            expect(result).toEqual(postToDelete);
            expect(postRepository.delete).toHaveBeenCalledWith(uuid);
        });
    });
});
