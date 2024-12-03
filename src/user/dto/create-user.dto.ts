import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsDateString,
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { IsOlderThan } from './custom';

export class CreateUserDto {
  @IsDefined()
  @IsString()
  firstName: string;

  @IsDefined()
  @IsString()
  lastName: string;

  @IsDefined()
  @IsString()
  nickName: string;

  @IsString()
  @MinLength(3, { message: 'UserName is too short!' })
  userName: string;

  @IsDefined()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  languages: string[];

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.split(',') : value,
  )
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  languagesToLearn?: string[];

  @IsDefined()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOlderThan(15, { message: 'Date of birth must be at least 15 years ago' })
  dob: Date;

  @IsDefined()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  telegramUserName: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  vkId: string;

  @IsString()
  @IsOptional()
  facebookId: string;

  @IsString()
  @IsOptional()
  weChatId: string;

  @IsString()
  @IsOptional()
  instagramUserName: string;

  @IsDefined()
  @IsString()
  country: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsDefined()
  @IsString()
  @MinLength(6)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak!',
  })
  password: string;

  @IsString()
  @IsOptional()
  referalId: string;

  // @IsEnum(Sex)
  // sex: Sex;
  @IsDefined()
  @IsString()
  sex: string;
}
