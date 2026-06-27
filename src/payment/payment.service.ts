import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, PlanType } from '../users/user.entity';

interface PaymentSession {
  sessionId: string;
  userId: string;
  planType: PlanType;
  createdAt: Date;
  status: 'pending' | 'verified';
}

/**
 * Interface representing payment session response
 */
export interface PaymentSessionResponse {
  paymentUrl: string;
  sessionId: string;
  planType: PlanType;
}

/**
 * Service for handling payment operations and creating payment sessions
 */
@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private readonly paymentSessions = new Map<string, PaymentSession>();

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a payment session for the specified plan type
   * @param planType The subscription plan type
   * @param userId The user ID making the payment request
   * @returns Payment session information with mock payment URL
   */
  async createPaymentSession(planType: PlanType, userId: string): Promise<PaymentSessionResponse> {
    this.logger.log(`User ${userId} is attempting to create payment session for plan: ${planType}`);
    
    // Convert planType to uppercase for case-insensitive validation
    const normalizedPlanType = planType.toUpperCase() as PlanType;
    
    // Validate the plan type
    this.validatePlanType(normalizedPlanType);
    
    // Validate amount matches expected price
    const expectedAmount = this.getPlanPrice(normalizedPlanType);
    this.logger.log(`Expected amount for ${normalizedPlanType}: $${expectedAmount}`);
    
    // Generate mock session ID (in real implementation, this would come from payment provider)
    const sessionId = this.generateMockSessionId(userId, normalizedPlanType);
    const transactionId = `abc${sessionId}`;
    
    // Store session in memory
    const paymentSession: PaymentSession = {
      sessionId,
      userId,
      planType: normalizedPlanType,
      createdAt: new Date(),
      status: 'pending'
    };
    this.paymentSessions.set(transactionId, paymentSession);
    
    // Generate mock payment URL (in real implementation, this would be PayPal URL)
    const paymentUrl = this.generateMockPaymentUrl(sessionId);
    
    this.logger.log(`Payment session created successfully for user ${userId}, plan: ${normalizedPlanType}, session: ${sessionId}, transaction: ${transactionId}`);
    
    return {
      paymentUrl,
      sessionId: transactionId,
      planType: normalizedPlanType,
    };
  }

  /**
   * Validate the provided plan type
   * @param planType The plan type to validate
   * @throws BadRequestException if plan type is invalid
   */
  private validatePlanType(planType: PlanType): void {
    const validPlans = [PlanType.WEEKLY, PlanType.MONTHLY];
    
    if (!validPlans.includes(planType)) {
      this.logger.error(`Invalid plan type provided: ${planType}`);
      throw new BadRequestException(`Invalid plan type: ${planType}. Valid plans are: ${validPlans.join(', ')}`);
    }
    
    this.logger.log(`Plan type validation passed for: ${planType}`);
  }

  /**
   * Generate a mock session ID for testing purposes
   * @param userId The user ID
   * @param planType The plan type
   * @returns Mock session ID
   */
  private generateMockSessionId(userId: string, planType: PlanType): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `session_${userId}_${planType}_${timestamp}_${random}`;
  }

  /**
   * Generate a mock payment URL for testing purposes
   * @param sessionId The session ID
   * @returns Mock payment URL
   */
  private generateMockPaymentUrl(sessionId: string): string {
    return `https://wander-lust-5qdo.vercel.app/subscription/success?session=${sessionId}`;
  }

  /**
   * Get plan pricing information
   * @param planType The plan type
   * @returns Plan pricing in USD
   */
  getPlanPrice(planType: PlanType): number {
    const prices: Record<PlanType, number> = {
      [PlanType.WEEKLY]: 10,
      [PlanType.MONTHLY]: 20,
      [PlanType.FREE]: 0,
      [PlanType.YEARLY]: 99,
    };
    
    return prices[planType] || 0;
  }

  /**
   * Get plan duration in days
   * @param planType The plan type
   * @returns Plan duration in days
   */
  getPlanDuration(planType: PlanType): number {
    const durations: Record<PlanType, number> = {
      [PlanType.WEEKLY]: 7,
      [PlanType.MONTHLY]: 30,
      [PlanType.FREE]: 0,
      [PlanType.YEARLY]: 365,
    };
    
    return durations[planType] || 0;
  }

  /**
   * Verify payment and upgrade user subscription
   * @param transactionId The transaction ID to verify
   * @param userId The user ID making the verification request
   * @param planType The plan type that was purchased
   * @returns Updated user subscription information
   */
  async verifyPayment(transactionId: string, userId: string, planType: PlanType): Promise<User> {
    this.logger.log(`User ${userId} is verifying payment with transaction ID: ${transactionId}`);
    
    // Find the payment session by transactionId
    const paymentSession = this.paymentSessions.get(transactionId);
    
    if (!paymentSession) {
      this.logger.error(`Payment session not found for transaction ID: ${transactionId}`);
      throw new BadRequestException('Payment session not found');
    }
    
    this.logger.log(`Found payment session: ${JSON.stringify(paymentSession)}`);
    
    // Validate that userId matches the session
    if (paymentSession.userId !== userId) {
      this.logger.error(`User ID mismatch. Expected ${paymentSession.userId}, got ${userId}`);
      throw new BadRequestException('User ID does not match payment session');
    }
    
    // Find the user
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      this.logger.error(`User not found: ${userId}`);
      throw new BadRequestException('User not found');
    }
    
    // Update session status to verified
    paymentSession.status = 'verified';
    this.paymentSessions.set(transactionId, paymentSession);
    
    // Calculate subscription end date based on plan type from session
    const duration = this.getPlanDuration(paymentSession.planType);
    const subscriptionEndDate = new Date();
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + duration);
    
    // Update user subscription information
    user.isPremium = true;
    user.planType = paymentSession.planType;
    user.subscriptionEndDate = subscriptionEndDate;
    user.subscriptionStartDate = new Date();
    
    // Save updated user
    const updatedUser = await this.userRepository.save(user);
    
    this.logger.log(`User ${userId} has been upgraded to Premium (${paymentSession.planType}) via transaction ${transactionId}`);
    this.logger.log(`Subscription will end on: ${subscriptionEndDate.toISOString()}`);
    
    return updatedUser;
  }
}
