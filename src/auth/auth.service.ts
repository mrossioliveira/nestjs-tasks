import { Injectable, Inject } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH_SERVICE') private client: ClientProxy) {}

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.client.send<any>('signup', authCredentialsDto).toPromise();
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{
    userId: number;
    username: string;
    accessToken: string;
    refreshToken: string;
  }> {
    return this.client.send<any>('signin', authCredentialsDto).toPromise();
  }

  async refresh(
    username: string,
    refreshToken: string,
  ): Promise<{ accessToken: string }> {
    return this.client.send('refresh', { username, refreshToken }).toPromise();
  }
}
