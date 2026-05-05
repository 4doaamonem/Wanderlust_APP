import { Injectable, Logger } from '@nestjs/common';

/**
 * Custom Logger Service for centralized application logging
 * Provides structured logging with context and different log levels
 */
@Injectable()
export class AppLoggerService {
  private readonly logger = new Logger(AppLoggerService.name);

  /**
   * Log informational messages
   * @param message The message to log
   * @param context Optional context for the log
   */
  logInfo(message: string, context?: string): void {
    this.logger.log(message, context);
  }

  /**
   * Log warning messages
   * @param message The message to log
   * @param context Optional context for the log
   */
  logWarning(message: string, context?: string): void {
    this.logger.warn(message, context);
  }

  /**
   * Log error messages
   * @param message The message to log
   * @param trace Optional error stack trace
   * @param context Optional context for the log
   */
  logError(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  /**
   * Log debug messages (development only)
   * @param message The message to log
   * @param context Optional context for the log
   */
  logDebug(message: string, context?: string): void {
    if (process.env.NODE_ENV === 'development') {
      this.logger.debug(message, context);
    }
  }

  /**
   * Log HTTP request details
   * @param method HTTP method
   * @param url Request URL
   * @param body Request body (optional)
   * @param userId User ID if authenticated
   */
  logRequest(method: string, url: string, body?: any, userId?: string): void {
    const logData = {
      method,
      url,
      body: body ? JSON.stringify(body) : undefined,
      userId,
      timestamp: new Date().toISOString(),
    };

    this.logInfo(`Incoming Request: ${method} ${url}`, JSON.stringify(logData));
  }

  /**
   * Log HTTP response details
   * @param statusCode HTTP status code
   * @param duration Request duration in milliseconds
   * @param userId User ID if authenticated
   */
  logResponse(statusCode: number, duration: number, userId?: string): void {
    const logData = {
      statusCode,
      duration: `${duration}ms`,
      userId,
      timestamp: new Date().toISOString(),
    };

    const statusLevel = statusCode >= 400 ? 'logWarning' : 'logInfo';
    this[statusLevel](`Response: ${statusCode} (${duration}ms)`, JSON.stringify(logData));
  }

  /**
   * Log database operations
   * @param operation Type of database operation
   * @param entity Entity name
   * @param details Additional details
   */
  logDatabase(operation: string, entity: string, details?: any): void {
    const logData = {
      operation,
      entity,
      details: details ? JSON.stringify(details) : undefined,
      timestamp: new Date().toISOString(),
    };

    this.logInfo(`Database: ${operation} on ${entity}`, JSON.stringify(logData));
  }

  /**
   * Log authentication events
   * @param event Type of auth event
   * @param userId User ID
   * @param details Additional details
   */
  logAuth(event: string, userId?: string, details?: any): void {
    const logData = {
      event,
      userId,
      details: details ? JSON.stringify(details) : undefined,
      timestamp: new Date().toISOString(),
    };

    this.logInfo(`Auth: ${event}`, JSON.stringify(logData));
  }
}
