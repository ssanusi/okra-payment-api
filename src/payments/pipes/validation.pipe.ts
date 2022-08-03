import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Injectable()
export class ArrayValidationPipe implements PipeTransform<any> {
  async transform(value: CreatePaymentDto[], { metatype }: ArgumentMetadata) {
    if (value instanceof Array && value.length > 0) {
      const errors = [];

      const objects = plainToInstance(CreatePaymentDto, value);

      for (const object of objects) {
        await validateOrReject(object).catch((error: ValidationError[]) =>
          error.forEach((error) =>
            errors.push(Object.values(error.constraints)),
          ),
        );
      }

      if (errors.length > 0) {
        throw new BadRequestException(errors);
      }
      return value;
    }
    throw new BadRequestException('Invalid array of Payments');
  }
}
