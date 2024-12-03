import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class createBlogCategoryDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  @IsOptional()
  id: number;
}
