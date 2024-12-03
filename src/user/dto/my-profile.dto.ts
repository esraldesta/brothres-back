import { Expose } from 'class-transformer';

export class MyProfileDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  bio: string;

  //   @Expose()
  //   followers: number;

  //   @Expose()
  //   following: number;

  @Expose()
  referalId: string | null;

  @Expose()
  city: string;

  @Expose()
  country: string;

  @Expose()
  role: string;
}
