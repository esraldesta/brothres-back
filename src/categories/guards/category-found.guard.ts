import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BlogCategory, Blogs, CategoryStatus } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ACCEPTED,
  IS_CATEGORY_FOUND_KEY,
} from '../decorators/category-found.decorator';

export interface CategoryRequest extends Request {
  category?: BlogCategory;
  [key: string | number]: any;
}

@Injectable()
export class CategoryFoundGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  private logger = new Logger(CategoryFoundGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isCategoryFound = this.reflector.get<ACCEPTED>(
      IS_CATEGORY_FOUND_KEY,
      context.getHandler(),
    );

    if (!isCategoryFound) return true;

    const request = context.switchToHttp().getRequest<CategoryRequest>();
    const categoryId = request.params.id;

    if (!categoryId || isNaN(parseInt(categoryId)))
      throw new NotFoundException('Category ID is missing the request');

    const category = await this.prisma.blogCategory.findUnique({
      where: {
        id: parseInt(categoryId),
      },
    });

    if (!category) {
      throw new NotFoundException('No Category found with this id.');
    }

    if (isCategoryFound.accepted) {
      if (category.status !== CategoryStatus.ACCEPTED) {
        throw new NotFoundException('No Category found with this id.');
      }
    }

    this.logger.log(isCategoryFound.accepted, 'ghost');
    request.category = category as BlogCategory;
    return true;
  }
}
