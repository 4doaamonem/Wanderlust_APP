import { Controller, Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PlansService } from '../services/plans.service';
import { CreatePlanDto, UpdatePlanDto, AddPlaceDto, PlanResponseDto } from '../dto/plans.dto';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // 1. Sub-resource Routes (Nested) - Most Specific
  @Post(':planId/places')
  @ApiOperation({ summary: 'Add a place to a plan' })
  @ApiResponse({ status: 201, description: 'Place added successfully', type: Object })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  @ApiBody({ type: AddPlaceDto })
  async addPlaceToPlan(
    @Param('planId') planId: string,
    @Body() addPlaceDto: AddPlaceDto
  ): Promise<any> {
    return this.plansService.addPlaceToPlan(planId, addPlaceDto);
  }

  @Delete(':planId/places/:placeId')
  @ApiOperation({ summary: 'Remove a place from a plan' })
  @ApiResponse({ status: 200, description: 'Place removed successfully' })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  @ApiParam({ name: 'placeId', description: 'Place ID' })
  async removePlaceFromPlan(
    @Param('planId') planId: string,
    @Param('placeId') placeId: string
  ): Promise<{ message: string }> {
    await this.plansService.removePlaceFromPlan(planId, placeId);
    return { message: 'Place removed successfully' };
  }

  // 2. Specific User Routes - Must come before general ID routes
  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all plans for a specific user' })
  @ApiResponse({ status: 200, description: 'Plans retrieved successfully', type: [PlanResponseDto] })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getUserPlans(@Param('userId') userId: string): Promise<PlanResponseDto[]> {
    const plans = await this.plansService.getUserPlans(userId);
    return plans.map(plan => this.mapToResponseDto(plan));
  }

  // 3. General Resource Routes (by ID) - Less Specific
  @Get(':planId')
  @ApiOperation({ summary: 'Get a single plan by ID' })
  @ApiResponse({ status: 200, description: 'Plan retrieved successfully', type: PlanResponseDto })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  async getPlan(@Param('planId') planId: string): Promise<PlanResponseDto> {
    const plan = await this.plansService.getPlanById(planId);
    return this.mapToResponseDto(plan);
  }

  @Put(':planId')
  @ApiOperation({ summary: 'Update a plan' })
  @ApiResponse({ status: 200, description: 'Plan updated successfully', type: PlanResponseDto })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  @ApiBody({ type: UpdatePlanDto })
  async updatePlan(
    @Param('planId') planId: string,
    @Body() updatePlanDto: UpdatePlanDto
  ): Promise<PlanResponseDto> {
    const plan = await this.plansService.updatePlan(planId, updatePlanDto);
    return this.mapToResponseDto(plan);
  }

  @Delete(':planId')
  @ApiOperation({ summary: 'Delete a plan' })
  @ApiResponse({ status: 200, description: 'Plan deleted successfully' })
  @ApiParam({ name: 'planId', description: 'Plan ID' })
  async deletePlan(@Param('planId') planId: string): Promise<{ message: string }> {
    await this.plansService.deletePlan(planId);
    return { message: 'Plan deleted successfully' };
  }

  // 4. Root Routes - Least Specific
  @Post()
  @ApiOperation({ summary: 'Create a new travel plan' })
  @ApiResponse({ status: 201, description: 'Plan created successfully', type: PlanResponseDto })
  @ApiBody({ type: CreatePlanDto })
  async createPlan(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    const plan = await this.plansService.createPlan(createPlanDto);
    return this.mapToResponseDto(plan);
  }

  private mapToResponseDto(plan: any): PlanResponseDto {
    return {
      id: plan.id,
      user: {
        id: plan.user?.id,
        name: plan.user?.name,
        email: plan.user?.email,
        subscriptionType: plan.user?.subscriptionType || 'free',
      },
      destination: plan.destination,
      planName: plan.planName,
      startDate: plan.startDate,
      endDate: plan.endDate,
      note: plan.note,
      places: plan.places || [],
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
