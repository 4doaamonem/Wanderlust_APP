import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';

/**
 * Guard to ensure that only premium users can access protected routes
 */
@Injectable()
export class PremiumGuard implements CanActivate {
  private readonly logger = new Logger(PremiumGuard.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Check if user has premium access by fetching latest data from database
   * @param context The execution context
   * @returns boolean indicating if the user can proceed
   * @throws ForbiddenException if user is not premium
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('PremiumGuard - checking user premium status from database');
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Check if user exists in JWT token
    if (!user || !user.userId) {
      this.logger.error('PremiumGuard - No user found in request');
      throw new ForbiddenException('User not authenticated');
    }
    
    // Fetch latest user data from database to get current isPremium status
    const latestUserData = await this.userRepository.findOne({ 
      where: { id: user.userId },
      select: ['id', 'isPremium', 'subscriptionEndDate', 'planType']
    });
    
    if (!latestUserData) {
      this.logger.error(`PremiumGuard - User not found in database: ${user.userId}`);
      throw new ForbiddenException('User not found');
    }
    
    // Check if user has premium status based on latest database data
    if (!latestUserData.isPremium) {
      this.logger.warn(`PremiumGuard - User ${user.userId} is not premium (isPremium: ${latestUserData.isPremium})`);
      throw new ForbiddenException('Premium subscription required to access this feature');
    }
    
    // Check if subscription is still valid (not expired)
    if (latestUserData.subscriptionEndDate && new Date() > latestUserData.subscriptionEndDate) {
      this.logger.warn(`PremiumGuard - User ${user.userId} subscription expired on ${latestUserData.subscriptionEndDate}`);
      throw new ForbiddenException('Premium subscription has expired');
    }
    
    this.logger.log(`PremiumGuard - User ${user.userId} has premium access (plan: ${latestUserData.planType})`);
    
    // Update request user with latest data for downstream use
    request.user = {
      ...user,
      isPremium: latestUserData.isPremium,
      planType: latestUserData.planType,
      subscriptionEndDate: latestUserData.subscriptionEndDate,
    };
    
    return true;
  }
}
