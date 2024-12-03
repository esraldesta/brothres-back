import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/shared/decorators/public.decorator';
import { TRACK_KEY_METADATA } from 'src/shared/decorators/track.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  private async tryAuthenticatePublicRoute(
    context: ExecutionContext,
  ): Promise<boolean> {
    try {
      await super.canActivate(context); // Attempt authentication
    } catch {
      // Ignore errors for public routes
    }
    return true; // Always allow public routes
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isTrack = this.reflector.getAllAndOverride<string>(
      TRACK_KEY_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (isTrack && isPublic) {
      return this.tryAuthenticatePublicRoute(context);
    }

    if (isPublic) return true;

    // Enforce authentication for private routes
    return super.canActivate(context);
  }
}
