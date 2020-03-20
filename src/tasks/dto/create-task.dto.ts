import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  @IsNotEmpty()
  listId: number;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  important: boolean;

  @ApiPropertyOptional()
  myDay: boolean;
}
