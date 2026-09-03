import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @ApiProperty({ description: 'User full name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ 
    description: 'User email address', 
    example: 'john.doe@example.com',
    format: 'email'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    description: 'User password', 
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ 
    description: 'Confirm password', 
    example: 'password123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirmPassword: string;
}
