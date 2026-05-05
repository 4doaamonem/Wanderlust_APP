import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Plan } from '../plans/plan.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Enum for user subscription plan types
 */
export enum PlanType {
  FREE = 'FREE',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

@Entity('users')
export class User {
  @ApiProperty({ description: 'User unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User full name' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ description: 'User email address', uniqueItems: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({ description: 'Hashed user password' })
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @ApiProperty({ description: 'Whether user has premium subscription', default: false })
  @Column({ type: 'boolean', default: false })
  isPremium: boolean;

  @ApiProperty({ description: 'User subscription plan type', enum: PlanType, default: PlanType.FREE })
  @Column({ 
    type: 'enum', 
    enum: PlanType,
    default: PlanType.FREE 
  })
  planType: PlanType;

  @ApiProperty({ description: 'Subscription start date', required: false })
  @Column({ type: 'datetime', nullable: true })
  subscriptionStartDate?: Date;

  @ApiProperty({ description: 'Subscription end date', required: false })
  @Column({ type: 'datetime', nullable: true })
  subscriptionEndDate?: Date;

  @ApiProperty({ description: 'User creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'User preferences', required: false })
  @Column({ type: 'text', nullable: true })
  preferences?: string;

  @ApiProperty({ description: 'User last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // @ApiProperty({ description: 'User travel plans', type: () => [Plan] })
  // @OneToMany(() => Plan, (plan: Plan) => plan.user, { cascade: true, onDelete: 'CASCADE' })
  plans: Plan[];
}
