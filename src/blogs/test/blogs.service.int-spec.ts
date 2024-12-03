import { PrismaService } from 'src/prisma/prisma.service';
import { BlogsService } from '../blogs.service';
import { Test } from '@nestjs/testing';
import { CloudStorageService } from 'src/shared/services/upload-file';
import { describe } from 'node:test';
import { AuthService } from 'src/auth/auth.service';
import { AppModule } from 'src/app.module';
import { blogDto, blogNoRefDto, mockFile, user } from 'src/_mocks_';
import { BlogType, Blogs, Reaction } from '@prisma/client';
import { EditBlogDto } from '../dto/update-blog.dto';

describe('BlogService Int', () => {
  //   let prisma: PrismaService;
  let blogService: BlogsService;
  let cloudService: CloudStorageService;
  let authService: AuthService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      // providers: [BlogsService, CloudStorageService, PrismaService],
      imports: [AppModule],
    }).compile();

    // prisma = moduleRef.get(PrismaService);
    blogService = moduleRef.get(BlogsService);
    cloudService = moduleRef.get(CloudStorageService);
    authService = moduleRef.get(AuthService);
    prisma = moduleRef.get(PrismaService);
    await prisma.cleanDatabase();
  });

  describe('', () => {
    let userId: number;
    let blog: Blogs;
    it('should create user', async () => {
      await authService.register(user);
      userId = 1;
    });

    it('should create a blog', async () => {
      blog = await blogService.createBlog(
        userId,
        blogDto,
        BlogType.Blog,
        mockFile,
      );
      expect(blog.title).toBe(blogDto.title);
      expect(blog.blogType).toBe(BlogType.Blog);
    });

    it('should create a blog without image', async () => {
      const blog = await blogService.createBlog(
        userId,
        blogNoRefDto,
        BlogType.Blog,
      );
      expect(blog.title).toBe(blogNoRefDto.title);
      expect(blog.blogType).toBe(BlogType.Blog);
    });

    it('should edit a blog', async () => {
      const editDto = {
        title: 'new title',
      } as EditBlogDto;

      const editdBlog = await blogService.editBlog(
        editDto,
        userId,
        blog,
        // mockFile,
      );
      expect(editdBlog.title).toBe(editDto.title);
    });

    it('should like a blogs', async () => {
      let reaction = await blogService.likeBlog(1, userId);
      expect(reaction).toStrictEqual({ reaction: Reaction.LIKE });

      reaction = await blogService.likeBlog(1, userId);
      expect(reaction).toStrictEqual({ reaction: null });

      await blogService.disLikeBlog(1, userId);

      reaction = await blogService.likeBlog(1, userId);
      expect(reaction).toStrictEqual({ reaction: Reaction.LIKE });
    });

    it('should dislike a blogs', async () => {
      let reaction = await blogService.disLikeBlog(1, userId);
      expect(reaction).toStrictEqual({ reaction: Reaction.DISLIKE });

      reaction = await blogService.disLikeBlog(1, userId);
      expect(reaction).toStrictEqual({ reaction: null });

      await blogService.likeBlog(1, userId);

      reaction = await blogService.disLikeBlog(1, userId);
      expect(reaction).toStrictEqual({ reaction: Reaction.DISLIKE });
    });
  });
});
