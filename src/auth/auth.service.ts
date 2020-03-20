import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/auth/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ userId: number; username: string; accessToken: string }> {
    const authResponse = await this.userRepository.validatePassword(
      authCredentialsDto,
    );
    if (!authResponse) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username: authResponse.username };
    const accessToken = await this.jwtService.sign(payload);

    return {
      userId: authResponse.userId,
      username: authResponse.username,
      accessToken,
    };
  }
}
