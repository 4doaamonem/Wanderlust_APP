import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

/**
 * Global Logging Interceptor
 * Intercepts all HTTP requests and responses to provide comprehensive logging
 * Helps track 404 errors and debugging issues
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const startTime = Date.now();

    // Extract request details
    const method = request.method;
    const url = request.url;
    const userAgent = request.get('User-Agent') || 'Unknown';
    const ip = request.ip || request.connection.remoteAddress || 'Unknown';
    
    // Get user ID from request if available (from JWT payload)
    const userId = (request as any).user?.userId || 'Anonymous';

    // Log incoming request
    this.logIncomingRequest(method, url, request.body, userAgent, ip, userId);

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          
          // Log successful response
          this.logResponse(method, url, statusCode, duration, userId, data);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || error.response?.statusCode || 500;
          
          // Log error response
          this.logError(method, url, statusCode, duration, userId, error);
        },
      }),
    );
  }

  /**
   * Log incoming request details
   */
  private logIncomingRequest(
    method: string,
    url: string,
    body: any,
    userAgent: string,
    ip: string,
    userId: string,
  ): void {
    // Sanitize body for logging (remove sensitive data)
    const sanitizedBody = this.sanitizeBody(body);

    const requestData = {
      method,
      url,
      body: sanitizedBody,
      userAgent,
      ip,
      userId,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(
      `➡️  ${method} ${url} - User: ${userId} - IP: ${ip}`,
      JSON.stringify(requestData, null, 2),
    );

    // Special logging for potential 404 scenarios
    if (url.includes('/api/')) {
      const apiPath = url.replace('/api', '');
      this.logger.debug(`API Request: ${apiPath}`, `Method: ${method}, User: ${userId}`);
    }
  }

  /**
   * Log successful response
   */
  private logResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId: string,
    data?: any,
  ): void {
    const responseData = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      userId,
      timestamp: new Date().toISOString(),
    };

    const logLevel = statusCode >= 400 ? 'warn' : 'log';
    this.logger[logLevel](
      `⬅️  ${method} ${url} - ${statusCode} (${duration}ms) - User: ${userId}`,
      JSON.stringify(responseData, null, 2),
    );

    // Log response data size for debugging
    if (data) {
      const dataSize = JSON.stringify(data).length;
      this.logger.debug(`Response Size: ${dataSize} bytes`, `URL: ${url}`);
    }
  }

  /**
   * Log error response
   */
  private logError(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    userId: string,
    error: any,
  ): void {
    const errorData = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
      userId,
      error: error.message || 'Unknown error',
      stack: error.stack,
      timestamp: new Date().toISOString(),
    };

    this.logger.error(
      `❌ ${method} ${url} - ${statusCode} (${duration}ms) - User: ${userId}`,
      JSON.stringify(errorData, null, 2),
    );

    // Special emphasis on 404 errors
    if (statusCode === 404) {
      this.logger.error(
        `🚨 404 NOT FOUND: ${method} ${url}`,
        `Check if route exists and controller is properly registered. User: ${userId}`,
      );
    }
  }

  /**
   * Sanitize request body to remove sensitive information
   */
  private sanitizeBody(body: any): any {
    if (!body) return undefined;

    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    // Limit body size for logging
    const bodyString = JSON.stringify(sanitized);
    if (bodyString.length > 1000) {
      return '[BODY TOO LARGE - ' + bodyString.substring(0, 1000) + '...]';
    }

    return sanitized;
  }
}
