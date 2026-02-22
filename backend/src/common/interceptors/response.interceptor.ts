import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../dto/api-response.dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponseDto<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T>> {
    return next.handle().pipe(
      map((data: T | { message?: string; data?: T }) => {
        const response = new ApiResponseDto<T>();

        // Check if data has the custom wrapper structure
        if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          'data' in data
        ) {
          response.success = true;
          response.message =
            (data as { message: string }).message || 'Request successful';
          response.data = (data as { data: T }).data;
        } else {
          // Regular response without wrapper
          response.success = true;
          response.message = 'Request successful';
          response.data = data as T;
        }

        return response;
      }),
    );
  }
}
