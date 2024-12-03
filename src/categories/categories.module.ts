import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CategoriesRepository } from '../shared/repositories/categories.repository';
import { APP_GUARD } from '@nestjs/core';
import { CategoryFoundGuard } from './guards/category-found.guard';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    PrismaService,
    CategoriesRepository,
    { provide: APP_GUARD, useClass: CategoryFoundGuard },
  ],
})
export class CategoriesModule {}
