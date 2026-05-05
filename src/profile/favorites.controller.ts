import { Controller, Get, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavoriteResponseDto } from './dto';
import { AppLoggerService } from '../logger/app-logger.service';

/**
 * Controller for handling user favorites operations
 */
// @ApiTags('Favorites') - Consolidated under Profile tag
@ApiBearerAuth()
@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {

  constructor(
    private readonly profileService: ProfileService,
    private readonly appLogger: AppLoggerService,
  ) {}

  /**
   * Get user's favorite places
   * @param req The request object containing user information
   * @returns Array of user's favorite places
   */
  @Get()
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
    this.appLogger.logInfo(`User ${req.user.userId} is requesting their favorites`, 'FavoritesController');
    
    const favorites = await this.profileService.getUserFavorites(req.user.userId);
    
    this.appLogger.logInfo(`Retrieved ${favorites.length} favorites for user ${req.user.userId}`, 'FavoritesController');
    
    return favorites;
  }

  /**
   * Delete a favorite place
   * @param favoriteId The favorite ID to delete
   * @param req The request object containing user information
   */
  @Delete(':id')
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
    this.appLogger.logInfo(`User ${req.user.userId} is deleting favorite ${favoriteId}`, 'FavoritesController');
    
    await this.profileService.deleteFavorite(req.user.userId, favoriteId);
    
    this.appLogger.logInfo(`Favorite ${favoriteId} deleted successfully by user ${req.user.userId}`, 'FavoritesController');
  }
}
