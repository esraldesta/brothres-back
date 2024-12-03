import { ValidationPipe, ArgumentMetadata } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log('ValidationPipe triggered for:', metadata.type);
    return super.transform(value, metadata);
  }
}
