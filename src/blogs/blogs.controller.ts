import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { writeBlogDto } from './dto/write-blog.dto';
import { BlogType, Blogs, Comments, Reaction } from '@prisma/client';
import { Public } from 'src/shared/decorators/public.decorator';
import { EditBlogDto } from './dto/update-blog.dto';
import { File } from 'src/types';
import { FileUploadInterceptor } from 'src/shared/utils/file-validator';
import { TrackKey } from 'src/shared/decorators/track.decorator';
import { IsBlogFound } from 'src/shared/decorators/blog-found.decorator';
import { BlogFoundRequest } from './guards/blog-found.guard';
import { BlogWithAuthor } from 'src/auth/types/blog-response';
import { createBlogCategoryDto } from './dto/create-category.dto';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @TrackKey('write-blog')
  @Post('write-blog')
  @UseInterceptors(FileUploadInterceptor('image', 1))
  WriteBlog(
    @Req() req,
    @Body() dto: writeBlogDto,
    @UploadedFile() image?: File,
  ): Promise<Blogs> {
    return this.blogsService.createBlog(req.user.id, dto, BlogType.Blog, image);
  }

  @TrackKey('write-blog')
  @Post('write-vblog')
  @UseInterceptors(FileUploadInterceptor('image', 1))
  WriteVBlog(
    @Req() req,
    @Body() dto: writeBlogDto,
    @UploadedFile() image?: File,
  ): Promise<{ id: number }> {
    return this.blogsService.createBlog(
      req.user.id,
      dto,
      BlogType.VBlog,
      image,
    );
  }

  @Public()
  @TrackKey('all')
  @Get('list')
  blogsList(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<{ blogs: Array<Blogs>; count: number }> {
    return this.blogsService.getBlogsList(page, pageSize);
  }

  @Public()
  @Get('search')
  searchBlog(@Query('query') query: string): Promise<Array<Blogs>> {
    return this.blogsService.getSearchBlogs(query);
  }

  @Public()
  @Get('user/blog/:id')
  getUserBlogs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 6,
  ) {
    return this.blogsService.getUserBlogs(id, BlogType.Blog, page, pageSize);
  }

  @Public()
  @Get('user/vblog/:id')
  getUserVBlogs(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 6,
  ): Promise<{ blogs: Array<Blogs>; count: number }> {
    return this.blogsService.getUserBlogs(id, BlogType.VBlog, page, pageSize);
  }

  @IsBlogFound()
  @TrackKey('write-blog')
  @Patch(':id/edit')
  @UseInterceptors(FileUploadInterceptor('image', 1))
  editBlog(
    @Body() dto: EditBlogDto,
    @Req() req,
    @UploadedFile() image?: File,
  ): Promise<Blogs> {
    return this.blogsService.editBlog(dto, req.user.id, req.blog, image);
  }

  @Public()
  @IsBlogFound()
  @TrackKey('blog', 'id')
  @Get(':id')
  getBlog(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<BlogWithAuthor | null> {
    return this.blogsService.getBlog(id);
  }

  @Public()
  @IsBlogFound()
  @Get(':id/stat')
  getBlogStat(@Param('id', ParseIntPipe) id: number): Promise<{
    commentsCount: number;
    likesCount: number;
    dislikesCount: number;
  }> {
    return this.blogsService.getBlogStat(id);
  }

  @IsBlogFound()
  @Get(':id/reaction')
  getUserBlogReaction(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<{ reaction: Reaction | null }> {
    return this.blogsService.getUserReaction(id, req.user.id);
  }

  @IsBlogFound()
  @Post(':id/write-comment')
  writeComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() { content }: { content: string },
    @Req() req,
  ): Promise<Comments> {
    return this.blogsService.writeComment(id, content, req.user.id);
  }

  @Public()
  @IsBlogFound()
  @Get(':id/comments')
  getComments(@Param('id', ParseIntPipe) id: number): Promise<Array<Comments>> {
    return this.blogsService.getComments(id);
  }

  @IsBlogFound()
  @Patch(':id/like')
  likeBlog(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<{ reaction: Reaction | null }> {
    return this.blogsService.likeBlog(id, req.user.id);
  }

  @IsBlogFound()
  @Patch(':id/dislike')
  dislikeBlog(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<{ reaction: Reaction | null }> {
    return this.blogsService.disLikeBlog(id, req.user.id);
  }

  @IsBlogFound()
  @Delete(':id/delete')
  deleteBlog(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
    return this.blogsService.deleteBlog(req.blog, req.user.id);
  }
}
