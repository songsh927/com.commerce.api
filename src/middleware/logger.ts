import { Observable } from 'rxjs';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    
    private readonly logger = new Logger(LoggerInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const url = request.url;
        // const body = request.body || {};
        // const params = request.params;
        // const query = request.query;

        this.logger.log(`Request to ${method} ${url}`);

        return next.handle()
    }
}