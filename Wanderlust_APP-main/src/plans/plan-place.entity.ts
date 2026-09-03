import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Plan } from './plan.entity';

@Entity('plan_places')
export class PlanPlace {
  @ApiProperty({ description: 'Place unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Place name' })
  @Column({ type: 'varchar', length: 255 })
  placeName: string;

  @ApiProperty({ description: 'Place category' })
  @Column({ type: 'varchar', length: 100 })
  category: string;

  @ApiProperty({ description: 'Plan this place belongs to', type: () => Plan })
  @ManyToOne(() => Plan, (plan: Plan) => plan.places, { onDelete: 'CASCADE' })
  plan: Plan;

  @ApiProperty({ description: 'Place creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Place last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
