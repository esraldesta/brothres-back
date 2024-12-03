import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto & { myReferalId: string }) {
    console.log(createUserDto);
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findByUserName(userName: string) {
    return await this.prisma.user.findUnique({
      where: {
        userName,
      },
    });
  }

  async findOne(userId: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }
  async updateRefreshToken(userId: number, token: string | null) {
    console.log(token, userId);
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: token,
      },
    });
  }

  async updateUser(userId: number, value: Partial<UpdateUserDto>) {
    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: value,
    });
  }
  async getFounders(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    return await this.prisma.user.findMany({
      select: {
        id: true,
        createdAt: true,
        country: true,
        firstName: true,
      },
      skip: skip,
      take: pageSize,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
  async getUsersCount() {
    return await this.prisma.user.count();
  }

  async getRefered(page: number, pageSize: number, id: string) {
    const skip = (page - 1) * pageSize;
    console.log(id);
    return await this.prisma.user.findMany({
      where: {
        referalId: id,
      },
      select: {
        id: true,
        createdAt: true,
        country: true,
        firstName: true,
      },
      skip: skip,
      take: pageSize,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async getReferedCount(id: string) {
    return await this.prisma.user.count({
      where: {
        referalId: id,
      },
    });
  }
}
