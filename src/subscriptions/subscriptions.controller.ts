import { Controller, Get, UseGuards, Logger } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscriptionPlansListResponseDto } from './dto';

/**
 * Controller for managing subscription plans and user subscriptions
 */
// @ApiTags('Subscriptions') - Hidden until ready for implementation
@ApiBearerAuth()
@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  private readonly logger = new Logger(SubscriptionsController.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  /**
   * Get all available subscription plans
   * @returns List of subscription plans with type, price, and features
   */
  @Get('plans')
  @ApiOperation({ 
    summary: 'Get all available subscription plans',
    description: 'Returns all available subscription plans with their features and pricing'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Subscription plans retrieved successfully',
    type: SubscriptionPlansListResponseDto 

  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getSubscriptionPlans(): Promise<any[]> {
    this.logger.log('Requesting subscription plans');
    
    return await this.subscriptionsService.getSubscriptionPlans();
  }
}
