import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, ValidateIf } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'User email address (required if resetToken is not provided)',
    example: 'john.doe@example.com',
    format: 'email',
    required: false,
  })
  @ValidateIf((dto: ResetPasswordDto) => !dto.resetToken)
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'Temporary reset token returned from verify-reset-code (required if email is not provided)',
    required: false,
  })
  @ValidateIf((dto: ResetPasswordDto) => !dto.email)
  @IsString()
  @IsNotEmpty()
  resetToken?: string;

  @ApiProperty({
    description: 'New password',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  newPassword: string;

  @ApiProperty({
    description: 'Confirm new password',
    example: 'newPassword123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  confirmPassword: string;
}
