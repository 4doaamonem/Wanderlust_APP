import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { PlanPlace } from './plan-place.entity';
import { User } from '../users/user.entity';

@Entity('plans')
export class Plan {
  @ApiProperty({ description: 'Plan unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User who owns this plan', type: () => User })
  @ManyToOne(() => User, (user: User) => user.plans, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({ description: 'Travel destination' })
  @Column({ type: 'varchar', length: 255 })
  destination: string;

  @ApiProperty({ description: 'Plan name' })
  @Column({ type: 'varchar', length: 255 })
  planName: string;

  @ApiProperty({ description: 'Plan start date' })
  @Column({ type: 'datetime' })
  startDate: Date;

  @ApiProperty({ description: 'Plan end date' })
  @Column({ type: 'datetime' })
  endDate: Date;

  @ApiProperty({ description: 'Additional notes about the plan', required: false })
  @Column({ type: 'text', nullable: true })
  note?: string;

  @ApiProperty({ description: 'Places in this plan', type: () => [PlanPlace] })
  @OneToMany(() => PlanPlace, (place: PlanPlace) => place.plan, { cascade: true, onDelete: 'CASCADE' })
  places: PlanPlace[];

  @ApiProperty({ description: 'Plan creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Plan last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
