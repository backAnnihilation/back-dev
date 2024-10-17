import { RoutingEnum } from '@app/shared';
import { BaseRouting } from './base-api.routing';

export class PostsRouting extends BaseRouting {
  constructor() {
    super(RoutingEnum.posts);
  }
  getUserPosts = (id: string) => `${this.baseUrl}/${id}/posts`;
  getPosts = () => this.baseUrl;
  getPost = (id: string) => `${this.baseUrl}/${id}`;
  createPost = () => this.baseUrl;
  updatePost = (id: string) => `${this.baseUrl}/${id}`;
  deletePost = (id: string) => `${this.baseUrl}/${id}`;
}
