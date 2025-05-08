import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * AuthGuard is used to protect routes that require authentication
 * It checks if the user is authenticated by verifying the JWT token
 * and if the user exists in the database
 * If the user is authenticated, it adds the user to the request object
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (!token) return false;
    const result = await this.authService.getUserFromJWT(token);
    if (result instanceof Error) {
      console.error(
        '[AUTH GUARD ERROR] an error occured while proccessing the token : ',
        result,
      );
      return false;
    }
    request.user = result;
    return true;
  }
}
