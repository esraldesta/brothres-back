import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsOlderThan(
  years: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isOlderThan',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date)) return false;
          const today = new Date();
          const yearsAgo = new Date(
            today.getFullYear() - years,
            today.getMonth(),
            today.getDate(),
          );
          return value <= yearsAgo;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be at least ${years} years ago.`;
        },
      },
    });
  };
}
