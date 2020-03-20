import { PipeTransform, BadRequestException } from '@nestjs/common';

export class ParseBooleanPipe implements PipeTransform {
  readonly allowedValues = ['TRUE', 'FALSE'];

  transform(value: any) {
    if (!value) {
      throw new BadRequestException(`Boolean value is required`);
    }

    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} is not a valid boolean`);
    }

    return value === 'TRUE';
  }

  private isStatusValid(value: any) {
    return this.allowedValues.indexOf(value) !== -1;
  }
}
