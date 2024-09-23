import { PostController } from './post.controller';
import { PostRepository } from './post.repository';
import { PostService } from './post.service';
import { asClass } from 'awilix';

export const postModule = {
    postRepository: asClass(PostRepository).singleton(),
    postService: asClass(PostService).singleton(),
    postController: asClass(PostController).singleton(),
}
