import { IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty()
  listId: number;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  important: boolean;
}
