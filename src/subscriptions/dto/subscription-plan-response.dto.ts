import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for subscription plan response
 */
export class SubscriptionPlanResponseDto {
  @ApiProperty({ description: 'Unique identifier for the subscription plan' })
  id: string;

  @ApiProperty({ description: 'Name of the subscription plan' })
  name: string;

  @ApiProperty({ description: 'Price in USD for the subscription plan' })
  price: number;

  @ApiProperty({ description: 'Duration of the subscription in days' })
  duration: number;

  @ApiProperty({ description: 'List of features included in this subscription plan' })
  features: string[];

  @ApiProperty({ description: 'Description of the subscription plan' })
  description: string;

  @ApiProperty({ description: 'Whether this is a popular/recommended plan' })
  isPopular: boolean;
}

/**
 * DTO for subscription plans list response
 */
export class SubscriptionPlansListResponseDto {
  @ApiProperty({ description: 'Array of available subscription plans', type: [SubscriptionPlanResponseDto] })
  plans: SubscriptionPlanResponseDto[];

  @ApiProperty({ description: 'Current user subscription status', required: false })
  currentStatus?: string;

  @ApiProperty({ description: 'Whether user has premium subscription', required: false })
  isPremium?: boolean;
}
