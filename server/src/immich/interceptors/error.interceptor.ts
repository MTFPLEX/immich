import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { routeToErrorMessage } from '../app.utils';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  private logger = new Logger(ErrorInterceptor.name);

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    return next.handle().pipe(
      catchError((error) =>
        throwError(() => {
          if (error instanceof HttpException === false) {
            const errorMessage = routeToErrorMessage(context.getHandler().name);
            this.logger.error(errorMessage, error, error?.errors);
            return new InternalServerErrorException(errorMessage);
          } else {
            return error;
          }
        }),
      ),
    );
  }
}