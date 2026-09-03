import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { ProfileSeedService } from './profile-seed.service';
import { User } from '../users/user.entity';
import { Favorite } from './favorite.entity';
import { Plan } from '../plans/plan.entity';
import { LoggerModule } from '../logger/logger.module';

/**
 * Module for handling user profile operations
 */
@Module({
  imports: [TypeOrmModule.forFeature([User, Favorite, Plan]), LoggerModule],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileSeedService],
  exports: [ProfileService],
})
export class ProfileModule {}
