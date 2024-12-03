import { Expose } from 'class-transformer';

export class ProfileDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  userName: string;

  @Expose()
  languages: string[];

  @Expose()
  nickName: string;

  @Expose()
  bio: string;
}
