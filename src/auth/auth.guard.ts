import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const token = req.headers['authorization']?.split(' ')[1];
      const res = this.client.send('validateToken', token).toPromise<boolean>();
      return res;
    } catch (error) {
      Logger.error(error);
      return false;
    }
  }
}
