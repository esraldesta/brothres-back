import { IsArray, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class writeBlogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  references: string[];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => value.split(','))
  tags: string[];

  @IsString()
  @IsOptional()
  videoLink: string;
}
