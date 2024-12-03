import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    // secret: process.env.JWT_SECRET,
    secret: 'Qy1pQuvpDhLnIdIuecWu4ZfwwIkJPqDjIyqE5r0dwdM=',
    signOptions: {
      // expiresIn: process.env.JWT_EXPIRES_IN,
      expiresIn: '120s',
    },
  }),
);
