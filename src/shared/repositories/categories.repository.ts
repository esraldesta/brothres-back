import { Injectable } from '@nestjs/common';
import {
  BlogType,
  CateGoryComments,
  CategoryStatus,
  Comments,
  Reaction,
} from '@prisma/client';
import { contains } from 'class-validator';
import { createBlogCategoryDto } from 'src/blogs/dto/create-category.dto';
import { writeBlogDto } from 'src/blogs/dto/write-blog.dto';
import { writeCommentDto } from 'src/categories/dto/write-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // categories
  async findCategoryById(id: number) {
    return this.prisma.blogCategory.findFirst({
      where: {
        id: id,
      },
    });
  }

  async createCategory(
    dto: Omit<createBlogCategoryDto, 'id'> & { status?: CategoryStatus },
    userId: number,
  ) {
    return this.prisma.blogCategory.create({
      data: {
        ...dto,
        managerId: userId,
      },
    });
  }

  async createCategoryRelation(
    childId: number,
    parentId: number,
    status: CategoryStatus = CategoryStatus.PENDING,
  ) {
    return this.prisma.blogCategoryRelation.create({
      data: {
        parentId: parentId,
        childId: childId,
        status: status,
      },
    });
  }

  async getUserFollowedCat(catId: number, userId: number) {
    return this.prisma.cateGoryFollowers.findFirst({
      where: {
        userId: userId,
        categoryId: catId,
      },
    });
  }

  async removeFollow(catId: number) {
    return this.prisma.cateGoryFollowers.delete({
      where: {
        id: catId,
      },
    });
  }

  async createFollow(catId: number, userId: number) {
    return this.prisma.cateGoryFollowers.create({
      data: {
        userId: userId,
        categoryId: catId,
      },
    });
  }

  async getUserJoinedCat(catId: number, userId: number) {
    return this.prisma.cateGoryMembers.findFirst({
      where: {
        userId: userId,
        categoryId: catId,
      },
    });
  }

  async getJoinedCount(userId: number) {
    return this.prisma.cateGoryMembers.count({
      where: {
        userId: userId,
      },
    });
  }

  async removeJoin(catId: number) {
    return this.prisma.cateGoryMembers.delete({
      where: {
        id: catId,
      },
    });
  }

  async createJoin(catId: number, userId: number) {
    return this.prisma.cateGoryMembers.create({
      data: {
        userId: userId,
        categoryId: catId,
      },
    });
  }

  async getUserLikedCat(catId: number, userId: number) {
    return this.prisma.cateGoryLikes.findFirst({
      where: {
        userId: userId,
        categoryId: catId,
      },
    });
  }

  async removeLike(catId: number) {
    return this.prisma.cateGoryLikes.delete({
      where: {
        id: catId,
      },
    });
  }

  async createLike(catId: number, userId: number) {
    return this.prisma.cateGoryLikes.create({
      data: {
        userId: userId,
        categoryId: catId,
      },
    });
  }

  async writeComment(dto: writeCommentDto, categoryId: number, userId: number) {
    return this.prisma.cateGoryComments.create({
      data: {
        categoryId: categoryId,
        userId: userId,
        ...dto,
      },
    });
  }

  async findCommentById(commentId: number) {
    return this.prisma.cateGoryComments.findFirst({
      where: {
        id: commentId,
      },
    });
  }

  async followersCount(catId: number) {
    return this.prisma.cateGoryFollowers.count({
      where: {
        categoryId: catId,
      },
    });
  }

  async membersCount(catId: number) {
    return this.prisma.cateGoryMembers.count({
      where: {
        categoryId: catId,
      },
    });
  }

  async commentsCount(catId: number) {
    return this.prisma.cateGoryComments.count({
      where: {
        categoryId: catId,
      },
    });
  }

  async categoryFollowers(catId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    return this.prisma.cateGoryFollowers.findMany({
      where: {
        categoryId: catId,
      },

      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            userName: true,
            id: true,
          },
        },
      },
      skip: skip,
      take: pageSize,
    });
  }

  async categoryMembers(catId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    return this.prisma.cateGoryMembers.findMany({
      where: {
        categoryId: catId,
      },

      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            userName: true,
            id: true,
          },
        },
      },
      skip: skip,
      take: pageSize,
    });
  }

  async categoryComments(catId: number, page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;

    return this.prisma.cateGoryComments.findMany({
      where: {
        categoryId: catId,
      },

      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            userName: true,
            id: true,
          },
        },
      },
      skip: skip,
      take: pageSize,
    });
  }
}
