import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskListDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;
}
