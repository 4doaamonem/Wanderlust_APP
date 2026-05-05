import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for payment verification request
 */
export class VerifyPaymentDto {
  @ApiProperty({ 
    description: 'Transaction ID for payment verification',
    example: 'abc123xyz'
  })
  @IsNotEmpty({ message: 'transactionId is required' })
  @IsString({ message: 'transactionId must be a string' })
  transactionId: string;

  @ApiProperty({ 
    description: 'User ID making the verification request',
    example: 'user-123'
  })
  @IsNotEmpty({ message: 'userId is required' })
  @IsString({ message: 'userId must be a string' })
  userId: string;
}

/**
 * DTO for payment verification response
 */
export class VerifyPaymentResponseDto {
  @ApiProperty({ description: 'Whether the payment was successfully verified' })
  success: boolean;

  @ApiProperty({ description: 'User premium status after verification' })
  isPremium: boolean;

  @ApiProperty({ description: 'User subscription plan type' })
  planType: string;

  @ApiProperty({ description: 'Subscription end date' })
  subscriptionEndDate: Date;

  @ApiProperty({ description: 'Verification message', required: false })
  message?: string;
}
