import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.convertBigIntToString(data)));
  }

  private convertBigIntToString(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertBigIntToString(item));
    } else if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
          if (value instanceof Date) {
            return [key, value.toISOString()];
          }
          return [key, this.convertBigIntToString(value)];
        }),
      );
    } else if (typeof obj === 'bigint') {
      return obj.toString();
    }
    return obj;
  }
}
