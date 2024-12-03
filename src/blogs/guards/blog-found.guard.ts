import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Blogs } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { IS_BLOG_FOUND_KEY } from 'src/shared/decorators/blog-found.decorator';

export interface BlogRequest extends Request {
  blog?: Blogs;
  [key: string | number]: any;
}

export interface BlogFoundRequest extends BlogRequest {
  blog: Blogs;
}

@Injectable()
export class BlogFoundGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private reflector: Reflector,
  ) {}
  private logger = new Logger(BlogFoundGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isBlogFound = this.reflector.get<boolean>(
      IS_BLOG_FOUND_KEY,
      context.getHandler(),
    );

    // const isBlogFound = this.reflector.getAllAndOverride<boolean>(
    //   IS_BLOG_FOUND_KEY,
    //   [context.getHandler(), context.getClass()],
    // );

    if (!isBlogFound) return true;
    this.logger.log(isBlogFound, 'what a fuck');

    const request = context.switchToHttp().getRequest<BlogRequest>();
    const blogId = request.params.id;

    if (!blogId || isNaN(parseInt(blogId)))
      throw new NotFoundException('Blog ID is missing the request');

    const blog = await this.prisma.blogs.findUnique({
      where: {
        id: parseInt(blogId),
      },
    });

    if (!blog) {
      throw new NotFoundException('No blog found with this id.');
    }
    request.blog = blog as Blogs;
    return true;
  }
}
