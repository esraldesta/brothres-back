import { Expose } from 'class-transformer';

export class SigninOkDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  userName: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  referalId: string | null;

  @Expose()
  city: string;

  @Expose()
  country: string;

  @Expose()
  role: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}
