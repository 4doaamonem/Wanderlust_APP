import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';

/**
 * DTO for updating user profile
 */
export class UpdateProfileDto {
  @ApiProperty({ 
    description: 'User name',
    example: 'John Doe'
  })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  name?: string;

  @ApiProperty({ 
    description: 'User preferences',
    example: 'adventure, culture, food'
  })
  @IsOptional()
  @IsString({ message: 'preferences must be a string' })
  preferences?: string;
}

/**
 * DTO for profile response
 */
export class ProfileResponseDto {
  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User premium status' })
  isPremium: boolean;

  @ApiProperty({ description: 'Subscription expiry date' })
  expiryDate: string | null;

  @ApiProperty({ description: 'User name', required: false })
  name?: string;

  @ApiProperty({ description: 'User preferences', required: false })
  preferences?: string;
}
