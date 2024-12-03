import { Injectable, NotFoundException } from '@nestjs/common';
import { BlogCategory, CateGoryComments, CategoryStatus } from '@prisma/client';
import { createBlogCategoryDto } from 'src/blogs/dto/create-category.dto';
import { writeBlogDto } from 'src/blogs/dto/write-blog.dto';
import { CategoriesRepository } from 'src/shared/repositories/categories.repository';
import { writeCommentDto } from './dto/write-comment.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}
  //categories
  async createBlogCategory(dto: createBlogCategoryDto, userId: number) {
    const { id, ...rest } = dto;

    if (id) {
      const parentCat = await this.categoriesRepository.findCategoryById(id);
      if (!parentCat)
        throw new NotFoundException('No Category found wth this id!');
    }

    if (!id) {
      const newCat = await this.categoriesRepository.createCategory(
        { ...rest, status: CategoryStatus.PENDING },
        userId,
      );
      return newCat.id;
    }

    const newCat = await this.categoriesRepository.createCategory(
      { ...rest, status: CategoryStatus.PENDING },
      userId,
    );
    await this.categoriesRepository.createCategoryRelation(newCat.id, id);
  }

  async follow(
    category: BlogCategory,
    userId: number,
  ): Promise<{ id: number | null }> {
    // if (category.status !== CategoryStatus.ACCEPTED) {
    //   throw new NotFoundException();
    // }
    const follow = await this.categoriesRepository.getUserFollowedCat(
      category.id,
      userId,
    );

    if (follow) {
      await this.categoriesRepository.removeFollow(follow.id);
      return { id: null };
    }

    const { id } = await this.categoriesRepository.createFollow(
      category.id,
      userId,
    );
    return { id };
  }

  async join(
    category: BlogCategory,
    userId: number,
  ): Promise<{ id: number | null }> {
    // if (category.status !== CategoryStatus.ACCEPTED) {
    //   throw new NotFoundException();
    // }
    const joined = await this.categoriesRepository.getUserJoinedCat(
      category.id,
      userId,
    );

    if (joined) {
      await this.categoriesRepository.removeJoin(joined.id);
      return { id: null };
    }

    const joinedCount = await this.categoriesRepository.getJoinedCount(userId);
    if (joinedCount > 4) {
      // change the exception
      throw new NotFoundException('You can not joined more than 5 categores!');
    }
    const { id } = await this.categoriesRepository.createJoin(
      category.id,
      userId,
    );
    return { id };
  }

  async like(
    category: BlogCategory,
    userId: number,
  ): Promise<{ id: number | null }> {
    // if (category.status !== CategoryStatus.ACCEPTED) {
    //   throw new NotFoundException();
    // }
    const liked = await this.categoriesRepository.getUserLikedCat(
      category.id,
      userId,
    );

    if (liked) {
      await this.categoriesRepository.removeLike(liked.id);
      return { id: null };
    }

    const { id } = await this.categoriesRepository.createLike(
      category.id,
      userId,
    );
    return { id };
  }

  async writeComment(
    dto: writeCommentDto,
    category: BlogCategory,
    userId: number,
  ): Promise<CateGoryComments> {
    if (dto.parentId) {
      const comment = this.categoriesRepository.findCommentById(dto.parentId);
      if (!comment) {
        dto.parentId = null;
      }
    }
    return await this.categoriesRepository.writeComment(
      dto,
      category.id,
      userId,
    );
  }

  async getFollowers(
    catId: number,
    page: number,
    pageSize: number,
  ): Promise<{ followers: object; count: number }> {
    const countPromise = this.categoriesRepository.followersCount(catId);
    const followersPromise = this.categoriesRepository.categoryFollowers(
      catId,
      page,
      pageSize,
    );

    const [count, followers] = await Promise.all([
      countPromise,
      followersPromise,
    ]);

    return {
      followers,
      count,
    };
  }

  async getMembers(
    catId: number,
    page: number,
    pageSize: number,
  ): Promise<{ members: object; count: number }> {
    const countPromise = this.categoriesRepository.membersCount(catId);
    const membersPromise = this.categoriesRepository.categoryMembers(
      catId,
      page,
      pageSize,
    );

    const [count, members] = await Promise.all([countPromise, membersPromise]);

    return {
      members,
      count,
    };
  }

  async getComments(
    catId: number,
    page: number,
    pageSize: number,
  ): Promise<{ comments: object; count: number }> {
    const countPromise = this.categoriesRepository.commentsCount(catId);
    const commentsPromise = this.categoriesRepository.categoryComments(
      catId,
      page,
      pageSize,
    );

    const [count, comments] = await Promise.all([
      countPromise,
      commentsPromise,
    ]);

    return {
      comments,
      count,
    };
  }
}
