import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users/user.entity';

/**
 * Entity for user favorite places
 */
@Entity('favorites')
export class Favorite {
  @ApiProperty({ description: 'Favorite unique identifier' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User ID who owns this favorite' })
  @Column({ type: 'varchar', length: 36 })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ description: 'Name of the favorite place' })
  @Column({ type: 'varchar', length: 255 })
  placeName: string;

  @ApiProperty({ description: 'Location/address of the place' })
  @Column({ type: 'varchar', length: 255 })
  location: string;

  @ApiProperty({ description: 'Description of the place', required: false })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ description: 'Favorite creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Favorite last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
