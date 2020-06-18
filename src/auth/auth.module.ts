import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './jwt.strategy';
import * as config from 'config';
import { ClientsModule, Transport } from '@nestjs/microservices';

const jwtConfig = config.get('jwt');

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_TCP_HOST || 'localhost',
          port: parseInt(process.env.AUTH_TCP_PORT) || 8000,
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
