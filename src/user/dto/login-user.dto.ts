// Other dependencies
import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  userName: string;

  @IsString()
  password: string;

  //! v2
  //   @IsBoolean()
  //   rememberMe: boolean;
}
