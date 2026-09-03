import { Injectable, ExecutionContext, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    this.logger.log('JwtAuthGuard - canActivate called');
    
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;
    this.logger.log('JwtAuthGuard - Authorization header:', token);
    
    try {
      const result = super.canActivate(context);
      this.logger.log('JwtAuthGuard - super.canActivate result:', result);
      return result;
    } catch (error) {
      this.logger.error('JwtAuthGuard - Error in canActivate:', error);
      this.logger.error('JwtAuthGuard - Error message:', error.message);
      this.logger.error('JwtAuthGuard - Error name:', error.name);
      throw error;
    }
  }

  handleRequest(err, user, info) {
    this.logger.log('JwtAuthGuard - handleRequest called');
    this.logger.log('JwtAuthGuard - err:', err);
    this.logger.log('JwtAuthGuard - user:', user);
    this.logger.log('JwtAuthGuard - info:', info);
    
    if (err) {
      this.logger.error('JwtAuthGuard - Passport error:', err);
      this.logger.error('JwtAuthGuard - Passport error message:', err.message);
      this.logger.error('JwtAuthGuard - Passport error name:', err.name);
      throw err;
    }
    
    if (!user) {
      this.logger.error('JwtAuthGuard - No user returned from passport');
      this.logger.error('JwtAuthGuard - Passport info object:', info);
      this.logger.error('JwtAuthGuard - Info message:', info?.message);
      this.logger.error('JwtAuthGuard - Info name:', info?.name);
      throw new Error('Unauthorized - No user found');
    }
    
    return user;
  }
}
