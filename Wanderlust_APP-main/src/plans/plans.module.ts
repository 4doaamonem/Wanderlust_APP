import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plan } from './plan.entity';
import { PlanPlace } from './plan-place.entity';
import { PlansService } from './services/plans.service';
import { PlansController } from './controllers/plans.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Plan, PlanPlace])],
  providers: [PlansService],
  controllers: [PlansController],
  exports: [PlansService],
})
export class PlansModule {}
