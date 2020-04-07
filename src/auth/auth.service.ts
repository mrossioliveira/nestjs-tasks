import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { UserRepository } from '../auth/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AccessRepository } from './access.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private accessRepository: AccessRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{
    userId: number;
    username: string;
    accessToken: string;
    refreshToken: string;
  }> {
    const authResponse = await this.userRepository.validatePassword(
      authCredentialsDto,
    );
    if (!authResponse) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { username: authResponse.username };
    const accessToken = await this.jwtService.sign(payload);

    // save refresh token
    const access = await this.accessRepository.getRefreshTokenByUsername(
      authResponse.username,
    );

    return {
      userId: authResponse.userId,
      username: authResponse.username,
      accessToken,
      refreshToken: access.refreshToken,
    };
  }

  async refresh(
    username: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    const access = await this.accessRepository.findOneByUsernameAndToken(
      username,
      refreshToken,
    );

    if (!access) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
