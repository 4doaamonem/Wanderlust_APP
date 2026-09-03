import { ApiProperty } from '@nestjs/swagger';

export class VerifyResetCodeResponseDto {
  @ApiProperty({ example: 'Reset code verified successfully' })
  message: string;

  @ApiProperty({ description: 'Temporary token used to reset the password' })
  resetToken: string;
}
