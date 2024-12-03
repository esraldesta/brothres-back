import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma/prisma.service';
import { TRACK_KEY_METADATA, TrackKey } from '../decorators/track.decorator';

interface AuthenticatedUser {
  id: string;
  [key: string]: any;
}

@Injectable()
export class VisitorTrackingInterceptor implements NestInterceptor {
  constructor(
    private prisma: PrismaService,
    private reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser; // User object set by AuthGuard
    const trackKey = this.reflector.get<TrackKey>(
      TRACK_KEY_METADATA,
      context.getHandler(),
    );

    // Proceed if there's no trackKey metadata or if trackKey exists
    if (!trackKey) {
      return next.handle();
    }

    if (user) {
      let param: string | undefined;
      if (trackKey.param) {
        param = request.params[trackKey.param];
      }
      return next.handle().pipe(
        tap(() => {
          this.trackUserActivity(user, { ...trackKey, param: param });
        }),
      );
    }

    return next.handle(); // If no user, simply proceed with the request.
  }

  private async trackUserActivity(user: any, trackKey: TrackKey) {
    const key = !trackKey.param
      ? trackKey.base
      : `${trackKey.base}-${trackKey.param}`;
    const today = new Date().toISOString().split('T')[0];

    try {
      await this.prisma.userActivity.upsert({
        where: {
          userId_trackKey_date: {
            userId: parseInt(user.id),
            trackKey: key,
            date: today,
          },
        },
        update: {}, // No update needed, since we're tracking the activity for the day
        create: {
          userId: user.id,
          trackKey: key,
          date: today,
        },
      });
    } catch (error) {
      //! dont understand why this is throwing p2002 error
    }
  }
}
