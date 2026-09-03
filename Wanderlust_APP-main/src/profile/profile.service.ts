import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Favorite } from './favorite.entity';
import { UpdateProfileDto, ProfileResponseDto, PlanListResponseDto, FavoriteResponseDto, ToggleFavoriteDto } from './dto';
import { Plan } from '../plans/plan.entity';
import { AppLoggerService } from '../logger/app-logger.service';

/**
 * Service for handling user profile operations
 */
@Injectable()
export class ProfileService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    private readonly appLogger: AppLoggerService,
  ) {}

  /**
   * Get user profile information
   * @param userId The user ID
   * @returns User profile data
   */
  async getProfile(userId: string): Promise<ProfileResponseDto> {
    this.appLogger.logInfo(`Fetching profile for user: ${userId}`, 'ProfileService');
    
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'email', 'isPremium', 'subscriptionEndDate', 'name', 'preferences']
    });
    
    if (!user) {
      this.appLogger.logError(`User not found: ${userId}`, undefined, 'ProfileService');
      throw new NotFoundException('User not found');
    }
    
    this.appLogger.logInfo(`Profile fetched successfully for user: ${userId}`, 'ProfileService');
    
    return {
      email: user.email,
      isPremium: user.isPremium,
      expiryDate: user.subscriptionEndDate ? user.subscriptionEndDate.toISOString() : null,
      name: user.name,
      preferences: user.preferences,
    };
  }

  /**
   * Update user profile information
   * @param userId The user ID
   * @param updateProfileDto The profile update data
   * @returns Updated user profile data
   */
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    this.appLogger.logInfo(`Updating profile for user: ${userId}`, 'ProfileService');
    
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      select: ['id', 'email', 'isPremium', 'subscriptionEndDate', 'name', 'preferences']
    });
    
    if (!user) {
      this.appLogger.logError(`User not found: ${userId}`, undefined, 'ProfileService');
      throw new NotFoundException('User not found');
    }
    
    // Update user fields if provided
    if (updateProfileDto.name !== undefined) {
      user.name = updateProfileDto.name;
    }
    
    if (updateProfileDto.preferences !== undefined) {
      user.preferences = updateProfileDto.preferences;
    }
    
    // Save the updated user
    const updatedUser = await this.userRepository.save(user);
    
    this.appLogger.logInfo(`Profile updated successfully for user: ${userId}`, 'ProfileService');
    
    return {
      email: updatedUser.email,
      isPremium: updatedUser.isPremium,
      expiryDate: updatedUser.subscriptionEndDate ? updatedUser.subscriptionEndDate.toISOString() : null,
      name: updatedUser.name,
      preferences: updatedUser.preferences,
    };
  }

  
  /**
   * Get user's favorite places
   * @param userId The user ID
   * @returns Array of user's favorite places
   */
  async getUserFavorites(userId: string): Promise<FavoriteResponseDto[]> {
    this.appLogger.logInfo(`Fetching favorites for user: ${userId}`, 'ProfileService');
    
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    
    this.appLogger.logInfo(`Found ${favorites.length} favorites for user: ${userId}`, 'ProfileService');
    
    return favorites.map(favorite => ({
      id: favorite.id,
      placeName: favorite.placeName,
      location: favorite.location,
      description: favorite.description,
    }));
  }

  /**
   * Delete a favorite place
   * @param userId The user ID
   * @param favoriteId The favorite ID to delete
   * @throws NotFoundException if favorite not found
   * @throws ForbiddenException if user doesn't own the favorite
   */
  async deleteFavorite(userId: string, favoriteId: string): Promise<void> {
    this.appLogger.logInfo(`User ${userId} is deleting favorite: ${favoriteId}`, 'ProfileService');
    
    const favorite = await this.favoriteRepository.findOne({
      where: { id: favoriteId },
    });
    
    if (!favorite) {
      this.appLogger.logError(`Favorite not found: ${favoriteId}`, undefined, 'ProfileService');
      throw new NotFoundException('Favorite not found');
    }
    
    if (favorite.userId !== userId) {
      this.appLogger.logError(`User ${userId} attempted to delete favorite owned by ${favorite.userId}`, undefined, 'ProfileService');
      throw new ForbiddenException('You can only delete your own favorites');
    }
    
    await this.favoriteRepository.remove(favorite);
    
    this.appLogger.logInfo(`Favorite ${favoriteId} deleted successfully by user ${userId}`, 'ProfileService');
  }

  /**
   * Get user's plans
   * @param userId The user ID
   * @returns Array of user's plans with planId and planName
   */
  async getUserPlans(userId: string): Promise<PlanListResponseDto[]> {
    this.appLogger.logInfo(`Fetching plans for user: ${userId}`, 'ProfileService');
    
    const plans = await this.planRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'planName'],
      order: { createdAt: 'DESC' }
    });
    
    this.appLogger.logInfo(`Found ${plans.length} plans for user: ${userId}`, 'ProfileService');
    
    return plans.map(plan => ({
      planId: plan.id,
      planName: plan.planName
    }));
  }

  /**
   * Toggle a favorite place (add if not exists, remove if exists)
   * @param userId The user ID
   * @param toggleFavoriteDto The toggle request data
   * @returns Updated list of favorites
   */
  async toggleFavorite(userId: string, toggleFavoriteDto: ToggleFavoriteDto): Promise<FavoriteResponseDto[]> {
    this.appLogger.logInfo(`User ${userId} is toggling favorite: ${toggleFavoriteDto.placeId}`, 'ProfileService');
    
    // For this implementation, we'll use placeId as a unique identifier by checking if any favorite
    // contains this placeId in its description or we can add it to the description field
    // Since the Favorite entity doesn't have a placeId field, we'll use placeName as the identifier
    
    // Check if favorite already exists by placeName (using placeId as placeName)
    const existingFavorite = await this.favoriteRepository.findOne({
      where: { 
        userId,
        placeName: toggleFavoriteDto.placeId // Using placeId as placeName for uniqueness
      }
    });
    
    if (existingFavorite) {
      // Remove existing favorite
      await this.favoriteRepository.remove(existingFavorite);
      this.appLogger.logInfo(`Removed favorite ${toggleFavoriteDto.placeId} for user ${userId}`, 'ProfileService');
    } else {
      // Add new favorite
      const newFavorite = this.favoriteRepository.create({
        userId,
        placeName: `Place ${toggleFavoriteDto.placeId}`,

        location: 'Location to be updated',

        description: 'Added via toggle endpoint',

      });
      await this.favoriteRepository.save(newFavorite);
      this.appLogger.logInfo(`Added favorite ${toggleFavoriteDto.placeId} for user ${userId}`, 'ProfileService');
    }
    
    // Return updated favorites list
    const updatedFavorites = await this.getUserFavorites(userId);
    
    this.appLogger.logInfo(`Favorite toggled successfully for user ${userId}`, 'ProfileService');
    
    return updatedFavorites;
  }
}
