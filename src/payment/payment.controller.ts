import { Controller, Post, Body, UseGuards, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService, PaymentSessionResponse } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlanType } from '../users/user.entity';
import { CreatePaymentSessionDto, PaymentSessionResponseDto, VerifyPaymentDto, VerifyPaymentResponseDto } from './dto';

/**
 * Controller for handling payment operations
 */
// @ApiTags('Payment') - Hidden until ready for implementation
@ApiBearerAuth()
@Controller('payment')
@UseGuards(JwtAuthGuard)
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * Create a payment session for the specified plan
   * @param createPaymentSessionDto The payment session creation request
   * @returns Payment session information with payment URL
   */
  @Post('create-session')
  @ApiOperation({ 
    summary: 'Create payment session',
    description: 'Creates a payment session for the specified subscription plan type'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Payment session created successfully',
    type: PaymentSessionResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid plan type' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createPaymentSession(
    @Body() createPaymentSessionDto: CreatePaymentSessionDto
  ): Promise<PaymentSessionResponse> {
    this.logger.log(`User ${createPaymentSessionDto.userId} is creating payment session for plan: ${createPaymentSessionDto.planType}`);
    
    const { userId, planType, amount } = createPaymentSessionDto;
    
    // Validate amount matches expected price for the plan
    const expectedAmount = this.paymentService.getPlanPrice(planType);
    if (amount !== expectedAmount) {
      throw new BadRequestException(`Amount mismatch. Expected $${expectedAmount} for ${planType}, but received $${amount}`);
    }
    
    // Create payment session using the service
    const paymentSession = await this.paymentService.createPaymentSession(planType, userId);
    
    this.logger.log(`Payment session created successfully for user ${userId} with session ID: ${paymentSession.sessionId}`);
    
    return paymentSession;
  }

  /**
   * Verify payment and upgrade user subscription
   * @param verifyPaymentDto The payment verification request
   * @returns Updated user subscription information
   */
  @Post('verify')
  @ApiOperation({ 
    summary: 'Verify payment and upgrade subscription',
    description: 'Verifies a payment transaction and upgrades the user subscription accordingly'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment verified and subscription upgraded successfully',
    type: VerifyPaymentResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid transaction ID or user not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async verifyPayment(
    @Body() verifyPaymentDto: VerifyPaymentDto
  ): Promise<any> {
    this.logger.log(`Verifying payment with transaction: ${verifyPaymentDto.transactionId}`);
    
    const { transactionId, userId } = verifyPaymentDto;
    
    // For now, we'll assume the user purchased a MONTHLY plan
    // In a real implementation, this would be retrieved from the payment session or transaction data
    const planType = PlanType.MONTHLY;
    
    // Verify payment and upgrade user subscription
    const updatedUser = await this.paymentService.verifyPayment(transactionId, userId, planType);
    
    this.logger.log(`Payment verification completed for user ${userId}`);
    
    return {
      success: true,
      message: 'Payment verified successfully. Subscription upgraded.',
      isPremium: updatedUser.isPremium,
      planType: updatedUser.planType,
      subscriptionEndDate: updatedUser.subscriptionEndDate!.toISOString(),
    };
  }
}
