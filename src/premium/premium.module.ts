import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PremiumController } from './premium.controller';
import { PremiumService } from './premium.service';
import { User } from '../users/user.entity';

/**
 * Module for premium features requiring subscription
 */
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [PremiumController],
  providers: [PremiumService],
  exports: [PremiumService],
})
export class PremiumModule {}
