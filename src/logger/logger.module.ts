import { Module } from '@nestjs/common';
import { AppLoggerService } from './app-logger.service';

/**
 * Logger Module for centralized logging functionality
 * Provides the custom AppLoggerService to the entire application
 */
@Module({
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
