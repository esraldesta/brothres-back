import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { createBlogCategoryDto } from 'src/blogs/dto/create-category.dto';
import { CategoriesService } from './categories.service';
import { IsCategoryFound } from './decorators/category-found.decorator';
import { Public } from 'src/shared/decorators/public.decorator';
import { CategoryRequest } from './guards/category-found.guard';
import { writeCommentDto } from './dto/write-comment.dto';
import { CateGoryComments } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  //categories
  @Post('create-category')
  createCategory(@Body() dto: createBlogCategoryDto, @Req() req) {
    return this.categoriesService.createBlogCategory(dto, req.user.id);
  }

  @IsCategoryFound()
  @Patch(':id/follow')
  followCateGory(@Req() req): Promise<{ id: number | null }> {
    return this.categoriesService.follow(req.category, req.user.id);
  }

  @IsCategoryFound()
  @Patch(':id/followers')
  getFollowers(
    @Req() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 6,
  ): Promise<{ followers: object; count: number }> {
    return this.categoriesService.getFollowers(req.category.id, page, pageSize);
  }

  @IsCategoryFound()
  @Patch(':id/join')
  joinCateGory(@Req() req): Promise<{ id: number | null }> {
    return this.categoriesService.join(req.category, req.user.id);
  }

  @IsCategoryFound()
  @Patch(':id/members')
  getMembers(
    @Req() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 6,
  ): Promise<{ members: object; count: number }> {
    return this.categoriesService.getMembers(req.category.id, page, pageSize);
  }

  @IsCategoryFound()
  @Patch(':id/like')
  likeCateGory(@Req() req): Promise<{ id: number | null }> {
    return this.categoriesService.like(req.category, req.user.id);
  }

  @IsCategoryFound()
  @Post(':id/comment')
  writeComment(
    @Body() dto: writeCommentDto,
    @Req() req,
  ): Promise<CateGoryComments> {
    return this.categoriesService.writeComment(dto, req.category, req.user.id);
  }

  @IsCategoryFound()
  @Patch(':id/comments')
  getComments(
    @Req() req,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 6,
  ): Promise<{ comments: object; count: number }> {
    return this.categoriesService.getComments(req.category.id, page, pageSize);
  }
}
