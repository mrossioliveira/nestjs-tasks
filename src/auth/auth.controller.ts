import { Controller, Post, Body, ValidationPipe, Logger } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';

const logger = new Logger('AuthController');

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  @Post('signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{
    userId: number;
    username: string;
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.signIn(authCredentialsDto);
  }

  @Post('refresh')
  refresh(
    @Body('username') username: string,
    @Body('refreshToken') refreshToken: string,
  ): Promise<{ accessToken: string }> {
    logger.log(`Refreshing token for ${username}`);
    return this.authService.refresh(username, refreshToken);
  }
}
