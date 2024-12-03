import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { TrackKey } from 'src/shared/decorators/track.decorator';
import { FileUploadInterceptor } from 'src/shared/utils/file-validator';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { ProfileDto } from './dto/profile-dto';
import { Founders, Refered } from 'src/types';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('update-profile')
  UpdateProfile(@Req() req, @Body() dto: UpdateUserDto): Promise<User> {
    return this.userService.updateUser(req.user.id, dto);
  }

  @Post('update-bio')
  updateBio(@Req() req, @Body() data: { bio: string }): Promise<User> {
    if (typeof data.bio !== 'string') {
      throw new BadRequestException('Bio must be a string.');
    }
    return this.userService.updateUserBio(req.user.id, data);
  }

  @Post('upload-avatar')
  @UseInterceptors(FileUploadInterceptor('image', 1))
  upLoadAvatar(
    @Req() req,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<{ image: string }> {
    return this.userService.uploadAvatar(req.user, image);
  }

  @Public()
  @TrackKey('founders')
  @Get('founders')
  getFounders(
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<{ founders: Array<Founders>; count: number }> {
    return this.userService.getFounders(page, pageSize);
  }

  @Get('referals')
  getRefered(
    @Req() req,
    @Query('page', ParseIntPipe) page: number,
    @Query('pageSize', ParseIntPipe) pageSize: number,
  ): Promise<{ refered: Array<Refered>; count: number }> {
    return this.userService.getRefered(page, pageSize, req.user.myReferalId);
  }

  @Public()
  @TrackKey('users', 'id')
  @Get(':id')
  getUserProfile(@Param('id', ParseIntPipe) id: number): Promise<ProfileDto> {
    return this.userService.getProfile(id);
  }
}
