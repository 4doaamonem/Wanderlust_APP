import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from '../plan.entity';
import { PlanPlace } from '../plan-place.entity';
import { CreatePlanDto, UpdatePlanDto, AddPlaceDto } from '../dto/plans.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
    @InjectRepository(PlanPlace)
    private readonly planPlaceRepository: Repository<PlanPlace>,
  ) {}

  async createPlan(createPlanDto: CreatePlanDto): Promise<Plan> {
    const { startDate, endDate, userId, ...planData } = createPlanDto;

    // Validate date range
    if (new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }

    const plan = this.planRepository.create({
      ...planData,
      user: { id: userId },
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return this.planRepository.save(plan);
  }

  async addPlaceToPlan(planId: string, addPlaceDto: AddPlaceDto): Promise<PlanPlace> {
    const plan = await this.planRepository.findOne({ where: { id: planId }, relations: ['places'] });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    const place = this.planPlaceRepository.create({
      ...addPlaceDto,
      plan,
    });

    return this.planPlaceRepository.save(place);
  }

  async getUserPlans(userId: string): Promise<Plan[]> {
    return this.planRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'places'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPlanById(planId: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({
      where: { id: planId },
      relations: ['user', 'places'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    return plan;
  }

  async updatePlan(planId: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const { startDate, endDate, ...updateData } = updatePlanDto;

    // Validate date range if provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      throw new BadRequestException('Start date must be before end date');
    }

    const plan = await this.planRepository.findOne({ where: { id: planId } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }

    Object.assign(plan, updateData);
    if (startDate) plan.startDate = new Date(startDate);
    if (endDate) plan.endDate = new Date(endDate);

    return this.planRepository.save(plan);
  }

  async deletePlan(planId: string): Promise<void> {
    const result = await this.planRepository.delete(planId);
    if (result.affected === 0) {
      throw new NotFoundException(`Plan with ID ${planId} not found`);
    }
  }

  async removePlaceFromPlan(planId: string, placeId: string): Promise<void> {
    const result = await this.planPlaceRepository.delete({ id: placeId, plan: { id: planId } });
    if (result.affected === 0) {
      throw new NotFoundException(`Place with ID ${placeId} not found in plan ${planId}`);
    }
  }
}
