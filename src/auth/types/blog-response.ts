import { Blogs } from '@prisma/client';

export interface BlogWithAuthor extends Blogs {
  author: {
    firstName: string;
    lastName: string;
    userName: string;
    image: string | null;
    id: number;
  };
}
