import { SetMetadata } from '@nestjs/common';

export const IS_BLOG_FOUND_KEY = 'IS_BLOG_FOUND';

export const IsBlogFound = () => SetMetadata(IS_BLOG_FOUND_KEY, true);
