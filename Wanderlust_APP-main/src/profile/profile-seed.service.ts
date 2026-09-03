import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { User } from '../users/user.entity';

/**
 * Service for seeding test data for profile module
 */
@Injectable()
export class ProfileSeedService {
  private readonly logger = new Logger(ProfileSeedService.name);

  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Seed mock favorite data for testing
   * @param userId The user ID to seed favorites for
   */
  async seedMockFavorites(userId: string): Promise<void> {
    this.logger.log(`Seeding mock favorites for user: ${userId}`);
    
    // Check if user already has favorites
    const existingFavorites = await this.favoriteRepository.find({
      where: { userId },
      take: 1,
    });
    
    if (existingFavorites.length === 0) {
      // Create mock favorite entries
      const mockFavorites = [
        {
          userId,
          placeName: 'Eiffel Tower',
          location: 'Paris, France',
          description: 'Iconic iron lattice tower and symbol of France',
        },
        {
          userId,
          placeName: 'Louvre Museum',
          location: 'Paris, France',
          description: 'World\'s largest art museum and historic monument',
        },
      ] as Partial<Favorite>[];
      
      await this.favoriteRepository.save(mockFavorites);
      
      this.logger.log(`Seeded ${mockFavorites.length} mock favorites for user ${userId}`);
    } else {
      this.logger.log(`User ${userId} already has favorites, skipping seed`);
    }
  }
}
