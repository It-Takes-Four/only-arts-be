import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any) {
    // If there's an error or no user, return null instead of throwing
    // This allows the request to continue without authentication
    if (err || !user) {
      return null;
    }
    return user;
  }
}
