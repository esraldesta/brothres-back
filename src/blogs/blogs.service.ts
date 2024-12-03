import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { writeBlogDto } from './dto/write-blog.dto';
import { BlogRepository } from 'src/shared/repositories/blog.repository';
import {
  BlogType,
  Blogs,
  CategoryStatus,
  Comments,
  Reaction,
} from '@prisma/client';
import { EditBlogDto } from './dto/update-blog.dto';
import { File } from 'src/types';
import { CloudStorageService } from 'src/shared/services/upload-file';
import { BlogWithAuthor } from 'src/auth/types/blog-response';
import { createBlogCategoryDto } from './dto/create-category.dto';

//! not found exception can be implemented in a guard
@Injectable()
export class BlogsService {
  constructor(
    private readonly blogRepository: BlogRepository,
    private readonly cloudStorageService: CloudStorageService,
  ) {}
  async createBlog(
    userId: number,
    dto: writeBlogDto,
    blogType: BlogType = BlogType.Blog,
    image?: File,
  ): Promise<Blogs> {
    let imageUrl = '';

    const existedBlog = await this.blogRepository.findBlogByTitle(dto.title);
    if (existedBlog)
      throw new ConflictException('A blog with similar title existes!');

    if (image) {
      const uploadResult = await this.cloudStorageService.uploadFile(
        image,
        'blog',
      );
      imageUrl = uploadResult?.publicUrl;
    }
    return await this.blogRepository.create(userId, dto, blogType, imageUrl);
  }

  async getBlogsList(
    page: number,
    pageSize: number,
  ): Promise<{ blogs: Array<Blogs>; count: number }> {
    //! find a better way of counting or save it in a table
    const blogsCount: number = await this.blogRepository.getCount();
    const blogs = await this.blogRepository.getBlogs(page, pageSize);
    return {
      blogs,
      count: blogsCount,
    };
  }

  async getSearchBlogs(query: string): Promise<Array<Blogs>> {
    if (query.length < 3) return [];

    return this.blogRepository.getSearch(query);
  }

  async getBlog(id: number): Promise<BlogWithAuthor | null> {
    return await this.blogRepository.getBlog(id);
  }

  async getBlogStat(id: number): Promise<{
    commentsCount: number;
    likesCount: number;
    dislikesCount: number;
  }> {
    //comments
    const commentsCount: number =
      await this.blogRepository.getCommentsCount(id);
    //like
    const likesCount: number = await this.blogRepository.getReactionCount(
      id,
      Reaction.LIKE,
    );
    //dislike
    const dislikesCount: number = await this.blogRepository.getReactionCount(
      id,
      Reaction.DISLIKE,
    );

    return {
      commentsCount,
      likesCount,
      dislikesCount,
    };
  }

  async writeComment(
    id: number,
    content: string,
    userId: number,
  ): Promise<Comments> {
    return this.blogRepository.createComment(id, content, userId);
  }

  async getComments(blogId: number): Promise<Array<Comments>> {
    return this.blogRepository.getBlogComments(blogId);
  }

  async likeBlog(
    blogId: number,
    userId: number,
  ): Promise<{ reaction: Reaction | null }> {
    const isLiked = await this.blogRepository.getLike(blogId, userId);

    await this.blogRepository.deleteReaction(blogId, userId);
    if (!isLiked) {
      await this.blogRepository.likeBlog(blogId, userId);
      return { reaction: Reaction.LIKE };
    }
    return { reaction: null };
  }

  async disLikeBlog(
    blogId: number,
    userId: number,
  ): Promise<{ reaction: Reaction | null }> {
    const isDisLiked = await this.blogRepository.getDisLike(blogId, userId);

    await this.blogRepository.deleteReaction(blogId, userId);
    if (!isDisLiked) {
      await this.blogRepository.disLikeBlog(blogId, userId);
      return { reaction: Reaction.DISLIKE };
    }
    return { reaction: null };
  }

  async getUserReaction(
    id: number,
    userId: number,
  ): Promise<{ reaction: Reaction | null }> {
    const reaction = await this.blogRepository.getUserReaction(id, userId);
    if (!reaction) {
      return { reaction: null };
    }
    return reaction;
  }

  async getUserBlogs(
    userId: number,
    type: BlogType,
    page: number,
    pageSize: number,
  ): Promise<{ blogs: Array<Blogs>; count: number }> {
    const blogs = await this.blogRepository.getUserBlogs(
      userId,
      type,
      page,
      pageSize,
    );
    const count = await this.blogRepository.getUserBlogsCount(userId, type);
    return {
      blogs,
      count,
    };
  }

  async deleteBlog(blog: Blogs, userId: number): Promise<void> {
    if (blog.authorId !== userId) throw new UnauthorizedException();

    if (blog.image) {
      this.cloudStorageService.removeFile(blog.image, 'blog');
    }
    await this.blogRepository.deleteBlog(blog.id);
  }

  async editBlog(
    dto: EditBlogDto,
    userId: number,
    blog: Blogs,
    image?: File,
  ): Promise<Blogs> {
    if (dto.title) {
      const blogWithSameTitle = await this.blogRepository.findBlogByTitle(
        dto.title,
      );
      if (blogWithSameTitle && blogWithSameTitle.id !== blog.id) {
        throw new ConflictException('A blog with same title exists');
      }
    }

    if (blog.authorId !== userId) throw new UnauthorizedException();

    let imageUrl = '';
    if (image) {
      const uploadResult = await this.cloudStorageService.uploadFile(
        image,
        'blog',
      );
      imageUrl = uploadResult?.publicUrl;

      if (blog.image) {
        await this.cloudStorageService.removeFile(blog.image, 'blog');
      }

      dto.image = imageUrl;
    } else {
      //if user sends a url
      if (dto.image === '') {
        dto.image = '';
      }
    }

    return await this.blogRepository.updateBlog(blog.id, dto);
  }
}
