import {
  Controller,
  Post,
  Put,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { VerifyResetCodeDto } from '../dto/verify-reset-code.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { VerifyResetCodeResponseDto } from '../dto/verify-reset-code-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: SignupDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'User already exists or passwords do not match' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async signup(@Body() signupDto: SignupDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user and return JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Post('forget-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request a password reset code' })
  @ApiBody({ type: ForgetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password reset code sent successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User with this email not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('verify-reset-code')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify the 6-digit password reset code' })
  @ApiBody({ type: VerifyResetCodeDto })
  @ApiResponse({
    status: 200,
    description: 'Reset code verified successfully',
    type: VerifyResetCodeResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset code' })
  async verifyResetCode(
    @Body() verifyResetCodeDto: VerifyResetCodeDto,
  ): Promise<VerifyResetCodeResponseDto> {
    return this.authService.verifyResetCode(verifyResetCodeDto);
  }

  @Put('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reset user password using email or reset token' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input, token, or passwords do not match' })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<MessageResponseDto> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Initiate Google OAuth2 authentication' })
  @ApiResponse({ status: 302, description: 'Redirects to Google login page' })
  googleAuth(): void {
    return;
  }
}
