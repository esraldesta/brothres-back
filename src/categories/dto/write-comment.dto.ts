import { IsInt, IsOptional, IsString } from 'class-validator';
export class writeCommentDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsInt()
  parentId: number | null;
}
