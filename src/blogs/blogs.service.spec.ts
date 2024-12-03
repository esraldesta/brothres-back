import { CloudStorageService } from 'src/shared/services/upload-file';
import { Test, TestingModule } from '@nestjs/testing';
import {
  mockBlogRepository,
  mockCloudStorageService,
  mockFile,
} from 'src/_mocks_';
import { BlogRepository } from 'src/shared/repositories/blog.repository';
import { BlogsService } from './blogs.service';
import { writeBlogDto } from './dto/write-blog.dto';
import { BlogType, Blogs } from '@prisma/client';
import { EditBlogDto } from './dto/update-blog.dto';

describe('UserService', () => {
  let service: BlogsService;
  let blogRepository: jest.Mocked<BlogRepository>;
  let cloudStorageService: jest.Mocked<CloudStorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        { provide: BlogRepository, useValue: mockBlogRepository },
        { provide: CloudStorageService, useValue: mockCloudStorageService },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
    blogRepository = module.get(BlogRepository);
    cloudStorageService = module.get(CloudStorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create blog', () => {
    const blog: writeBlogDto = {
      title: 'title',
      content: 'content',
      tags: ['tags'],
      references: ['ref'],
      videoLink: 'link',
    };

    it('should creat blog with image', async () => {
      cloudStorageService.uploadFile.mockResolvedValueOnce({
        publicUrl: 'image-url',
      });
      blogRepository.findBlogByTitle.mockResolvedValueOnce(null);
      blogRepository.create.mockResolvedValue({
        ...blog,
        image: 'image-url',
      } as Blogs);

      const result = await service.createBlog(1, blog, BlogType.Blog, mockFile);

      expect(cloudStorageService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'blog',
      );
      expect(blogRepository.create).toHaveBeenCalledWith(
        1,
        blog,
        BlogType.Blog,
        'image-url',
      );
      expect(result).toEqual(
        expect.objectContaining({
          title: blog.title,
          content: blog.content,
          image: 'image-url',
        }),
      );
    });

    it('should creat blog without image', async () => {
      cloudStorageService.uploadFile.mockResolvedValueOnce(null);
      blogRepository.findBlogByTitle.mockResolvedValueOnce(null);
      blogRepository.create.mockResolvedValue(blog as Blogs);

      const result = await service.createBlog(1, blog, BlogType.Blog, mockFile);

      expect(cloudStorageService.uploadFile).toHaveBeenCalledWith(
        mockFile,
        'blog',
      );
      expect(blogRepository.create).toHaveBeenCalledWith(
        1,
        blog,
        BlogType.Blog,
        undefined,
      );
      expect(result).toEqual(
        expect.objectContaining({
          title: blog.title,
          content: blog.content,
        }),
      );
    });
  });
  describe('edit-blog', () => {
    const newBlog = new EditBlogDto({
      title: 'title',
      content: 'content',
    });

    const oldBlog: Blogs = {
      id: 15,
      title: 'Exploring the Prisma ORM',
      content:
        'Prisma is a modern database toolkit for Node.js and TypeScript. It simplifies database access and management.',
      authorId: 123,
      tags: ['prisma', 'database', 'orm', 'nodejs'],
      references: [
        'https://www.prisma.io/docs',
        'https://github.com/prisma/prisma',
      ],
      image: 'https://example.com/images/prisma-guide.jpg',
      videoLink: 'https://example.com/videos/prisma-overview.mp4',
      blogType: 'Blog',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const userId = 123;
    it('should update though upload file failed', async () => {
      mockBlogRepository.findBlogByTitle.mockResolvedValueOnce({
        id: oldBlog.id,
      });
      mockCloudStorageService.uploadFile.mockResolvedValueOnce(null);
      mockCloudStorageService.removeFile(true);

      await service.editBlog(newBlog, userId, oldBlog, mockFile);
      expect(mockBlogRepository.updateBlog).toHaveBeenCalledWith(
        oldBlog.id,
        newBlog,
      );
    });

    it('it should set image to empty and remove old image if image is empty string', async () => {
      mockBlogRepository.findBlogByTitle.mockResolvedValueOnce({
        id: oldBlog.id,
      });

      mockCloudStorageService.removeFile.mockResolvedValueOnce(null);

      await service.editBlog({ ...newBlog, image: '' }, userId, oldBlog);

      expect(mockCloudStorageService.removeFile).toHaveBeenCalledWith(
        oldBlog.image,
        'blog',
      );

      expect(mockBlogRepository.updateBlog).toHaveBeenCalledWith(oldBlog.id, {
        ...newBlog,
        image: '',
      });
    });

    it('should update blog image if image is uploaded', async () => {
      mockBlogRepository.findBlogByTitle.mockResolvedValueOnce({
        id: oldBlog.id,
      });
      mockCloudStorageService.uploadFile.mockResolvedValueOnce({
        publicUrl: 'new-url',
      });
      mockCloudStorageService.removeFile.mockResolvedValueOnce(null);

      await service.editBlog(newBlog, userId, oldBlog, mockFile);

      expect(mockCloudStorageService.removeFile).toHaveBeenCalledWith(
        oldBlog.image,
        'blog',
      );

      expect(mockBlogRepository.updateBlog).toHaveBeenCalledWith(oldBlog.id, {
        ...newBlog,
        image: 'new-url',
      });
    });
  });
});
