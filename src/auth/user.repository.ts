import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from '../auth/dto/auth-credentials.dto';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

const UNIQUE_VIOLATION = '23505';
const logger = new Logger('UserRepository');

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, email, password } = authCredentialsDto;

    const salt = await bcrypt.genSalt();

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = await this.hashPassword(password, salt);
    user.salt = salt;

    try {
      await user.save();
    } catch (error) {
      logger.error(error);
      if (error.code === UNIQUE_VIOLATION) {
        let message = 'Username already exists';
        if (error.detail.indexOf('email') !== -1) {
          message = 'Email already exists';
        }
        throw new ConflictException(message);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validatePassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ userId: number; username: string }> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({ username });

    if (user && (await user.validatePassword(password))) {
      return {
        userId: user.id,
        username: user.username,
      };
    } else {
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
