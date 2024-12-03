import { SetMetadata } from '@nestjs/common';

export const IS_CATEGORY_FOUND_KEY = 'IS_CATEGORY_FOUND';

export interface ACCEPTED {
  accepted: Boolean;
}

export const IsCategoryFound = (accepted = true) => {
  return SetMetadata(IS_CATEGORY_FOUND_KEY, { accepted });
};
