import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/**
 * DTO for plan list response
 */
export class PlanListResponseDto {
  @ApiProperty({ description: 'Plan ID' })
  planId: string;

  @ApiProperty({ description: 'Plan name' })
  planName: string;
}

/**
 * DTO for favorite place response
 */
export class FavoriteResponseDto {
  @ApiProperty({ description: 'Favorite ID' })
  id: string;

  @ApiProperty({ description: 'Place name' })
  placeName: string;

  @ApiProperty({ description: 'Location/address' })
  location: string;

  @ApiProperty({ description: 'Description', required: false })
  description?: string;
}

/**
 * DTO for favorite toggle request
 */
export class ToggleFavoriteDto {
  @ApiProperty({ 
    description: 'Place ID to toggle',
    example: 'uuid-string'
  })
  @IsNotEmpty({ message: 'placeId is required' })
  @IsString({ message: 'placeId must be a string' })
  placeId: string;
}

/**
 * DTO for favorite list response
 */
export class FavoriteListResponseDto extends FavoriteResponseDto {}
