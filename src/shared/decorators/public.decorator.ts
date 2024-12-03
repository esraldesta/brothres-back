import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'IS_PUBLIC';
export const IS_PUBLIC_AND_REGISTER_KEY = 'IS_PUBLIC_AND_REGISTER';

// export const Public = (registerActivity = false) => {
//   if (registerActivity) return SetMetadata(IS_PUBLIC_AND_REGISTER_KEY, true);
//   return SetMetadata(IS_PUBLIC_KEY, true);
// };

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
