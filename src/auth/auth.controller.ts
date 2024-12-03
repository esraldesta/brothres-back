import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginDto } from 'src/user/dto/login-user.dto';
import { Public } from 'src/shared/decorators/public.decorator';
import { RefreshAuthGuard } from './guards/refresh-token/refresh-token.guard';
import { SigninOkDto } from 'src/user/dto/sign-in-ok.dto';
import { MyProfileDto } from 'src/user/dto/my-profile.dto';
import { MyFullProfileDto } from 'src/user/dto/my-full-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto): Promise<{ id: number }> {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('signin')
  signInUser(@Body() loginDto: LoginDto): Promise<SigninOkDto> {
    return this.authService.signIn(loginDto);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req): Promise<{ accessToken: string }> {
    return this.authService.refreshToken(req.user.id);
  }

  @Get('signout')
  signOutUser(@Req() req): Promise<void> {
    return this.authService.signOut(req.user.id);
  }

  @Get('profile')
  getProfile(@Req() req): Promise<MyProfileDto> {
    return this.authService.getProfile(req.user.id, MyProfileDto);
  }

  @Get('full-profile')
  getFullProfile(@Req() req): Promise<MyFullProfileDto> {
    return this.authService.getProfile(req.user.id, MyFullProfileDto);
  }
}
