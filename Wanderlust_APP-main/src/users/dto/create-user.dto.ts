import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'User email address', 
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'User password', 
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}
