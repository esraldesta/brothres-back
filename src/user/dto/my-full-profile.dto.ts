import { Expose, Transform } from 'class-transformer';

export class MyFullProfileDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  sex: string;

  //A date string is used in the front end
  @Expose()
  @Transform(({ value }) => value.toISOString().split('T')[0])
  dob: string;

  @Expose()
  languages: string[];

  @Expose()
  nickName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;

  @Expose()
  instagramUserName: string;

  @Expose()
  facebookId: string;

  @Expose()
  weChatId: string;

  @Expose()
  vkId: string;

  @Expose()
  telegramUserName: string;

  @Expose()
  city: string;

  @Expose()
  country: string;

  @Expose()
  state: string;
}
