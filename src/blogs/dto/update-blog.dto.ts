import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { writeBlogDto } from './write-blog.dto';

export class EditBlogDto extends PartialType(writeBlogDto) {
  @IsString()
  @IsOptional()
  image: string;
}

// export class EfditBlogDto {
//   @Type(() => Number) // Transform the string to a number
//   @IsInt()
//   id: number;

//   // @IsString()
//   // id: string;

//   @IsString()
//   @IsOptional()
//   title: string;

//   @IsString()
//   @IsOptional()
//   content: string;

//   @IsString()
//   @IsOptional()
//   image: string;

//   @IsArray()
//   @IsString({ each: true })
//   @IsOptional()
//   references: string[];

//   @IsArray()
//   @IsOptional()
//   @IsString({ each: true })
//   tags: string[];

//   @IsString()
//   @IsOptional()
//   videoLink: string;
// }
