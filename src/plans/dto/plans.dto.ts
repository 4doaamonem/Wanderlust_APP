import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePlanDto {
  @ApiProperty({ description: 'User ID who owns this plan' })
  @IsNotEmpty({ message: 'userId is required' })
  @IsString({ message: 'userId must be a string' })
  userId: string;

  @ApiProperty({ description: 'Travel destination' })
  @IsNotEmpty({ message: 'destination is required' })
  @IsString({ message: 'destination must be a string' })
  destination: string;

  @ApiProperty({ description: 'Plan name' })
  @IsNotEmpty({ message: 'planName is required' })
  @IsString({ message: 'planName must be a string' })
  planName: string;

  @ApiProperty({ description: 'Plan start date' })
  @IsNotEmpty({ message: 'startDate is required' })
  @IsDateString({}, { message: 'startDate must be a valid date' })
  startDate: string;

  @ApiProperty({ description: 'Plan end date' })
  @IsNotEmpty({ message: 'endDate is required' })
  @IsDateString({}, { message: 'endDate must be a valid date' })
  endDate: string;

  @ApiProperty({ description: 'Additional notes about the plan', required: false })
  @IsOptional()
  @IsString({ message: 'note must be a string' })
  note?: string;
}

export class AddPlaceDto {
  @ApiProperty({ description: 'Place name' })
  @IsNotEmpty({ message: 'placeName is required' })
  @IsString({ message: 'placeName must be a string' })
  placeName: string;

  @ApiProperty({ description: 'Place category' })
  @IsNotEmpty({ message: 'category is required' })
  @IsString({ message: 'category must be a string' })
  category: string;
}

export class UpdatePlanDto {
  @ApiProperty({ description: 'Travel destination', required: false })
  @IsOptional()
  @IsString({ message: 'destination must be a string' })
  destination?: string;

  @ApiProperty({ description: 'Plan name', required: false })
  @IsOptional()
  @IsString({ message: 'planName must be a string' })
  planName?: string;

  @ApiProperty({ description: 'Plan start date', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'startDate must be a valid date' })
  startDate?: string;

  @ApiProperty({ description: 'Plan end date', required: false })
  @IsOptional()
  @IsDateString({}, { message: 'endDate must be a valid date' })
  endDate?: string;

  @ApiProperty({ description: 'Additional notes about the plan', required: false })
  @IsOptional()
  @IsString({ message: 'note must be a string' })
  note?: string;
}

export class PlanPlaceDto {
  @ApiProperty({ description: 'Place unique identifier' })
  id: string;

  @ApiProperty({ description: 'Place name' })
  placeName: string;

  @ApiProperty({ description: 'Place category' })
  category: string;

  @ApiProperty({ description: 'Place creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Place last update timestamp' })
  updatedAt: Date;
}

export class PlanResponseDto {
  @ApiProperty({ description: 'Plan unique identifier' })
  id: string;

  @ApiProperty({ description: 'User who owns this plan', type: () => UserDto })
  user: any;

  @ApiProperty({ description: 'Travel destination' })
  destination: string;

  @ApiProperty({ description: 'Plan name' })
  planName: string;

  @ApiProperty({ description: 'Plan start date' })
  startDate: Date;

  @ApiProperty({ description: 'Plan end date' })
  endDate: Date;

  @ApiProperty({ description: 'Additional notes about the plan', required: false })
  note?: string;

  @ApiProperty({ description: 'Places in this plan', type: [PlanPlaceDto] })
  @IsArray()
  @Type(() => PlanPlaceDto)
  places: PlanPlaceDto[];

  @ApiProperty({ description: 'Plan creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Plan last update timestamp' })
  updatedAt: Date;
}

export class UserDto {
  @ApiProperty({ description: 'User unique identifier' })
  id: string;

  @ApiProperty({ description: 'User name' })
  name: string;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'User subscription type' })
  subscriptionType: string;
}
