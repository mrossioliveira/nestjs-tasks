import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from 'typeorm';

export class AuthCredentialsDto {
  @ApiProperty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsOptional({ always: true })
  @Unique('email', ['email'])
  email: string;
}
