import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

/**
 * DTO for packing tips request
 */
export class PackingTipsDto {
  @ApiProperty({ 
    description: 'Travel country',
    example: 'France'
  })
  @IsNotEmpty({ message: 'country is required' })
  @IsString({ message: 'country must be a string' })
  country: string;

  @ApiProperty({ 
    description: 'Travel start date (YYYY-MM-DD format)',
    example: '2026-07-15'
  })
  @IsNotEmpty({ message: 'startDate is required' })
  @IsString({ message: 'startDate must be a string' })
  startDate: string;

  @ApiProperty({ 
    description: 'Travel end date (YYYY-MM-DD format)',
    example: '2026-07-20'
  })
  @IsNotEmpty({ message: 'endDate is required' })
  @IsString({ message: 'endDate must be a string' })
  endDate: string;
}

/**
 * DTO for packing tips response
 */
export class PackingTipsResponseDto {
  @ApiProperty({ description: 'Recommended packing items' })
  items: string[];

  @ApiProperty({ description: 'Packing advice based on country and travel dates' })
  advice: string;
}

/**
 * DTO for simulate plan request
 */
export class SimulatePlanDto {
  @ApiProperty({ 
    description: 'Travel destination',
    example: 'Paris, France'
  })
  @IsNotEmpty({ message: 'destination is required' })
  @IsString({ message: 'destination must be a string' })
  destination: string;

  @ApiProperty({ 
    description: 'Travel budget',
    example: '2000'
  })
  @IsNotEmpty({ message: 'budget is required' })
  @IsString({ message: 'budget must be a string' })
  budget: string;

  @ApiProperty({ 
    description: 'Travel style preference',
    example: 'luxury'
  })
  @IsNotEmpty({ message: 'style is required' })
  @IsString({ message: 'style must be a string' })
  style: string;

  @ApiProperty({ 
    description: 'Travel interests',
    example: ['culture', 'food', 'art']
  })
  @IsArray({ message: 'interests must be an array' })
  @IsString({ each: true, message: 'each interest must be a string' })
  interests: string[];
}

/**
 * Interface for activity in itinerary
 */
export interface Activity {
  time: string;
  activity: string;
  cost: number;
}

/**
 * Interface for day itinerary in simulate plan response
 */
export interface DayItinerary {
  dayNumber: number;
  activities: Activity[];
}

/**
 * DTO for simulate plan response
 */
export class SimulatePlanResponseDto {
  @ApiProperty({ description: 'Destination of the trip' })
  destination: string;

  @ApiProperty({ description: 'Daily itinerary' })
  itinerary: DayItinerary[];

  @ApiProperty({ description: 'Total estimated cost' })
  totalEstimatedCost: number;
}
