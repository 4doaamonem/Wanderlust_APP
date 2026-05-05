import { Controller, Post, Body, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PremiumService } from './premium.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PremiumGuard } from './premium.guard';
import { PackingTipsDto, PackingTipsResponseDto, SimulatePlanDto, SimulatePlanResponseDto } from './dto';

/**
 * Controller for premium features requiring subscription
 */
// @ApiTags('Premium') - Hidden until ready for implementation
@ApiBearerAuth()
@Controller('premium')
@UseGuards(JwtAuthGuard, PremiumGuard)
export class PremiumController {
  private readonly logger = new Logger(PremiumController.name);

  constructor(private readonly premiumService: PremiumService) {}

  /**
   * Get personalized packing tips based on destination and month
   * @param packingTipsDto The packing tips request
   * @param req The request object containing user information
   * @returns Packing recommendations and advice
   */
  @Post('packing-tips')
  @ApiOperation({ 
    summary: 'Get personalized packing tips',
    description: 'Generate packing recommendations based on destination and travel month'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Packing tips generated successfully',
    type: PackingTipsResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Premium subscription required' })
  async getPackingTips(
    @Body() packingTipsDto: PackingTipsDto,
    @Request() req
  ): Promise<PackingTipsResponseDto> {
    this.logger.log(`User ${req.user.userId} is requesting packing tips for ${packingTipsDto.country} from ${packingTipsDto.startDate} to ${packingTipsDto.endDate}`);
    
    const packingTips = await this.premiumService.getPackingTips(packingTipsDto);
    
    this.logger.log(`Packing tips generated successfully for user ${req.user.userId}`);
    
    return packingTips;
  }

  /**
   * Simulate a travel plan based on user preferences
   * @param simulatePlanDto The simulate plan request
   * @param req The request object containing user information
   * @returns Structured 3-day itinerary
   */
  @Post('simulate-plan')
  @ApiOperation({ 
    summary: 'Simulate travel plan',
    description: 'Generate a structured 3-day itinerary based on destination, budget, style, and interests'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Travel plan simulated successfully',
    type: SimulatePlanResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Premium subscription required' })
  async simulatePlan(
    @Body() simulatePlanDto: SimulatePlanDto,
    @Request() req
  ): Promise<SimulatePlanResponseDto> {
    this.logger.log(`User ${req.user.userId} is simulating plan for ${simulatePlanDto.destination} with budget $${simulatePlanDto.budget}`);
    
    const travelPlan = await this.premiumService.simulatePlan(simulatePlanDto);
    
    this.logger.log(`Travel plan simulated successfully for user ${req.user.userId} with total estimated cost $${travelPlan.totalEstimatedCost}`);
    
    return travelPlan;
  }
}
