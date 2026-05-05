import { Injectable, Logger } from '@nestjs/common';
import { SubscriptionPlan, SubscriptionPlanType } from './interfaces/subscription-plan.interface';
import { SubscriptionPlanResponseDto, SubscriptionPlansListResponseDto } from './dto';

/**
 * Service for managing subscription plans and user subscriptions
 */
@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name);

  /**
   * Get all available subscription plans with their features
   * @returns Array of subscription plans
   */
  private getAllSubscriptionPlans(): SubscriptionPlan[] {
    return [
      {
        id: SubscriptionPlanType.WEEKLY,
        name: 'Weekly',
        price: 5,
        duration: 7,
        features: [
          'Access to all travel guides',
          'Basic packing tips',
          'Weather forecasts for 3 days',
          'Create up to 5 travel plans',
        ],
        description: 'Perfect for short trips and weekend getaways',
        isPopular: false,
      },
      {
        id: SubscriptionPlanType.MONTHLY,
        name: 'Monthly',
        price: 10,
        duration: 30,
        features: [
          'Access to all travel guides',
          'Advanced packing tips with AI recommendations',
          'Weather forecasts for 7 days',
          'Create unlimited travel plans',
          'Offline mode for downloaded guides',
          'Currency converter with real-time rates',
          'Priority customer support',
        ],
        description: 'Most popular choice for frequent travelers',
        isPopular: true,
      },
    ];
  }

  /**
   * Get all subscription plans formatted for API response
   * @param userStatus Current user subscription status (optional)
   * @returns Formatted subscription plans list
   */
  async getSubscriptionPlans(): Promise<any[]> {
    this.logger.log('Fetching all subscription plans');
    
    // Return exact frontend structure
    return [
      {
        type: 'weekly',
        price: 5,
        features: ['packing tips', 'offline mode', 'Simulate trip plan']
      },
      {
        type: 'monthly',
        price: 10,
        features: ['all features']
      }
    ];
  }

  /**
   * Get a specific subscription plan by its ID
   * @param planId The ID of the subscription plan
   * @returns The subscription plan or null if not found
   */
  async getSubscriptionPlanById(planId: string): Promise<SubscriptionPlan | null> {
    this.logger.log(`Fetching subscription plan with ID: ${planId}`);
    
    const plans = this.getAllSubscriptionPlans();
    const plan = plans.find(p => p.id === planId);
    
    if (plan) {
      this.logger.log(`Found subscription plan: ${plan.name}`);
    } else {
      this.logger.warn(`Subscription plan with ID ${planId} not found`);
    }
    
    return plan || null;
  }
}
