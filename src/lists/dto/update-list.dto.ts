import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateListDTO {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
}
