import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';

// @Injectable()
// export class PrismaService extends PrismaClient implements OnModuleInit {
//   async onModuleInit() {
//     await this.$connect();
//   }
// }
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get<string>('DATABASE_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV !== 'dev') return;

    const modelNames = Prisma.ModelName; // Prisma provides a list of model names
    const deleteOperations = Object.values(modelNames).map((modelName) => {
      const modelDelegate =
        this[modelName.charAt(0).toLowerCase() + modelName.slice(1)];
      if (modelDelegate && typeof modelDelegate.deleteMany === 'function') {
        return modelDelegate.deleteMany();
      }
      return null;
    });

    return Promise.all(deleteOperations.filter(Boolean));
  }
}
