import { Controller, Get, Put, Post, Delete, Body, Param, UseGuards, Request, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto, ProfileResponseDto, PlanListResponseDto, FavoriteResponseDto, ToggleFavoriteDto } from './dto';

/**
 * Controller for handling user profile operations
 */
@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly profileService: ProfileService,
  ) {}

  /**
   * Get user profile information
   * @param req The request object containing user information
   * @returns User profile data
   */
  @Get()
  @ApiOperation({ 
    summary: 'Get user profile',
    description: 'Retrieve user profile information including email, premium status, and subscription details'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile retrieved successfully',
    type: ProfileResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getProfile(@Request() req): Promise<ProfileResponseDto> {
    this.logger.log(`User ${req.user.userId} is requesting profile information`);
    
    const profile = await this.profileService.getProfile(req.user.userId);
    
    this.logger.log(`Profile information retrieved successfully for user ${req.user.userId}`);
    
    return profile;
  }

  /**
   * Get user's plans
   * @param req The request object containing user information
   * @returns Array of user's plans
   */
  @Get('plans')
  @ApiOperation({ 
    summary: 'Get user plans',
    description: 'Retrieve all travel plans for the current authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Plans retrieved successfully',
    type: [PlanListResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserPlans(@Request() req): Promise<PlanListResponseDto[]> {
    this.logger.log(`User ${req.user.userId} is requesting their plans`);
    
    const plans = await this.profileService.getUserPlans(req.user.userId);
    
    this.logger.log(`Retrieved ${plans.length} plans for user ${req.user.userId}`);
    
    return plans;
  }

  /**
   * Update user profile information
   * @param updateProfileDto The profile update data
   * @param req The request object containing user information
   * @returns Updated user profile data
   */
  @Put()
  @ApiOperation({ 
    summary: 'Update user profile',
    description: 'Update user profile information such as name and preferences'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Profile updated successfully',
    type: ProfileResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Request() req
  ): Promise<ProfileResponseDto> {
    this.logger.log(`User ${req.user.userId} is updating profile information`);
    
    const updatedProfile = await this.profileService.updateProfile(req.user.userId, updateProfileDto);
    
    this.logger.log(`Profile information updated successfully for user ${req.user.userId}`);
    
    return updatedProfile;
  }


  /**
   * Get user's favorite places
   * @param req The request object containing user information
   * @returns Array of user's favorite places
   */
  @Get('favorites')
  @ApiOperation({ 
    summary: 'Get user favorites',
    description: 'Retrieve all favorite places for the current authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Favorites retrieved successfully',
    type: [FavoriteResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserFavorites(@Request() req): Promise<FavoriteResponseDto[]> {
    this.logger.log(`User ${req.user.userId} is requesting their favorites`);
    
    const favorites = await this.profileService.getUserFavorites(req.user.userId);
    
    this.logger.log(`Retrieved ${favorites.length} favorites for user ${req.user.userId}`);
    
    return favorites;
  }

  /**
   * Delete a favorite place
   * @param favoriteId The favorite ID to delete
   * @param req The request object containing user information
   */
  @Delete('favorites/:id')
  @ApiOperation({ 
    summary: 'Delete favorite',
    description: 'Remove a place from user favorites. Users can only delete their own favorites'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Favorite ID to delete',
    type: 'string'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Favorite deleted successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Cannot delete other user favorites' })
  @ApiResponse({ status: 404, description: 'Favorite not found' })
  async deleteFavorite(
    @Param('id') favoriteId: string,
    @Request() req
  ): Promise<void> {
    this.logger.log(`User ${req.user.userId} is deleting favorite ${favoriteId}`);
    
    await this.profileService.deleteFavorite(req.user.userId, favoriteId);
    
    this.logger.log(`Favorite ${favoriteId} deleted successfully by user ${req.user.userId}`);
  }

  /**
   * Toggle a favorite place (add if not exists, remove if exists)
   * @param toggleFavoriteDto The toggle request data
   * @param req The request object containing user information
   * @returns Updated list of favorites
   */
  @Post('favorites')
  @ApiOperation({ 
    summary: 'Toggle favorite',
    description: 'Add a place to favorites if not exists, or remove if it exists. Essential for frontend favorite management.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Favorite toggled successfully',
    type: [FavoriteResponseDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async toggleFavorite(
    @Body() toggleFavoriteDto: ToggleFavoriteDto,
    @Request() req
  ): Promise<FavoriteResponseDto[]> {
    this.logger.log(`User ${req.user.userId} is toggling favorite: ${toggleFavoriteDto.placeId}`);
    
    const updatedFavorites = await this.profileService.toggleFavorite(req.user.userId, toggleFavoriteDto);
    
    this.logger.log(`Favorite toggled successfully for user ${req.user.userId}`);
    
    return updatedFavorites;
  }
}
