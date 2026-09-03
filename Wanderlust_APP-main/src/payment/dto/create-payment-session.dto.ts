import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { PlanType } from '../../users/user.entity';

/**
 * DTO for creating a payment session request
 */
export class CreatePaymentSessionDto {
  @ApiProperty({ description: 'User ID making the payment request' })
  @IsNotEmpty({ message: 'userId is required' })
  @IsString({ message: 'userId must be a string' })
  userId: string;

  @ApiProperty({ 
    description: 'The subscription plan type',
    enum: PlanType,
    enumName: 'PlanType'
  })
  @Transform(({ value }) => {
    // Convert to uppercase and trim whitespace
    const transformedValue = typeof value === 'string' ? value.trim().toUpperCase() : value;
    
    // Validate that the transformed value matches a valid PlanType
    const validPlanTypes = Object.values(PlanType);
    if (validPlanTypes.includes(transformedValue)) {
      return transformedValue;
    }
    
    // Return original value if invalid (validation will catch it)
    return value;
  })
  @IsEnum(PlanType, { message: 'planType must be a valid PlanType' })
  @IsNotEmpty({ message: 'planType is required' })
  @IsString({ message: 'planType must be a string' })
  planType: PlanType;

  @ApiProperty({ description: 'Payment amount for the selected plan' })
  @IsNotEmpty({ message: 'amount is required' })
  @IsNumber({}, { message: 'amount must be a number' })
  amount: number;
}

/**
 * DTO for payment session response
 */
export class PaymentSessionResponseDto {
  @ApiProperty({ description: 'Payment URL for redirecting to payment provider' })
  paymentUrl: string;

  @ApiProperty({ description: 'Unique session identifier for tracking the payment' })
  sessionId: string;

  @ApiProperty({ 
    description: 'The subscription plan type for this payment session',
    enum: PlanType,
    enumName: 'PlanType'
  })
  planType: PlanType;
}
