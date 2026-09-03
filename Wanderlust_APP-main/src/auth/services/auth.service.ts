import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { randomInt } from 'crypto';
import { User } from '../../users/user.entity';
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { ForgetPasswordDto } from '../dto/forget-password.dto';
import { VerifyResetCodeDto } from '../dto/verify-reset-code.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { MessageResponseDto } from '../dto/message-response.dto';
import { VerifyResetCodeResponseDto } from '../dto/verify-reset-code-response.dto';
import { EmailService } from './email.service';
import { GoogleUserProfile } from '../google.strategy';
import * as bcrypt from 'bcrypt';

const RESET_CODE_EXPIRY_MINUTES = 15;
const RESET_VERIFICATION_WINDOW_MINUTES = 15;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    const { firstName, lastName, email, password, confirmPassword } = signupDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      name: `${firstName} ${lastName}`.trim(),
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const token = this.jwtService.sign({
      sub: savedUser.id,
      email: savedUser.email,
    });

    return {
      accessToken: token,
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        isPremium: savedUser.isPremium,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<MessageResponseDto> {
    const { email } = forgetPasswordDto;

    const user = await this.findUserWithResetFields({ email });
    if (!user) {
      throw new NotFoundException('User with this email not found');
    }

    const resetCode = randomInt(100000, 999999).toString();
    const hashedResetCode = await bcrypt.hash(resetCode, 10);
    const resetCodeExpiresAt = new Date(Date.now() + RESET_CODE_EXPIRY_MINUTES * 60 * 1000);

    user.resetCode = hashedResetCode;
    user.resetCodeExpiresAt = resetCodeExpiresAt;
    user.resetVerifiedAt = undefined;

    await this.userRepository.save(user);

    await this.emailService.sendEmail(
      email,
      'Password Reset Code',
      `Your password reset code is: ${resetCode}. It expires in ${RESET_CODE_EXPIRY_MINUTES} minutes.`,
    );

    return { message: 'Password reset code sent successfully' };
  }

  async verifyResetCode(
    verifyResetCodeDto: VerifyResetCodeDto,
  ): Promise<VerifyResetCodeResponseDto> {
    const { email, resetCode } = verifyResetCodeDto;

    const user = await this.findUserWithResetFields({ email });
    if (!user || !user.resetCode || !user.resetCodeExpiresAt) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    if (user.resetCodeExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    const isCodeValid = await bcrypt.compare(resetCode, user.resetCode);
    if (!isCodeValid) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    user.resetVerifiedAt = new Date();
    await this.userRepository.save(user);

    const resetToken = this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        purpose: 'password-reset',
      },
      { expiresIn: `${RESET_VERIFICATION_WINDOW_MINUTES}m` },
    );

    return {
      message: 'Reset code verified successfully',
      resetToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<MessageResponseDto> {
    const { email, resetToken, newPassword, confirmPassword } = resetPasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    if (!email && !resetToken) {
      throw new BadRequestException('Either email or resetToken must be provided');
    }

    let user: User | null;

    if (resetToken) {
      user = await this.resolveUserFromResetToken(resetToken, email);
    } else {
      user = await this.findUserWithResetFields({ email });
      if (!user || !this.isResetVerificationValid(user)) {
        throw new BadRequestException('Reset verification expired or not completed');
      }
    }

    if (!user) {
      throw new BadRequestException('Unable to reset password for the provided credentials');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpiresAt = undefined;
    user.resetVerifiedAt = undefined;

    await this.userRepository.save(user);

    return { message: 'Password updated successfully' };
  }

  async googleLogin(profile: GoogleUserProfile): Promise<AuthResponseDto> {
    if (!profile.email) {
      throw new BadRequestException('Google account email is required');
    }

    let user = await this.userRepository.findOne({ where: { email: profile.email } });

    if (!user) {
      const name = `${profile.firstName} ${profile.lastName}`.trim() || profile.email;

      user = this.userRepository.create({
        name,
        email: profile.email,
        password: 'OAUTH_GOOGLE_ACCOUNT',
      });

      user = await this.userRepository.save(user);
    }

    const token = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
      },
    };
  }

  private async findUserWithResetFields(where: { email?: string; id?: string }): Promise<User | null> {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.resetCode')
      .addSelect('user.resetCodeExpiresAt')
      .addSelect('user.resetVerifiedAt');

    if (where.email) {
      queryBuilder.where('user.email = :email', { email: where.email });
    } else if (where.id) {
      queryBuilder.where('user.id = :id', { id: where.id });
    }

    return queryBuilder.getOne();
  }

  private isResetVerificationValid(user: User): boolean {
    if (!user.resetVerifiedAt) {
      return false;
    }

    const verificationExpiry =
      user.resetVerifiedAt.getTime() + RESET_VERIFICATION_WINDOW_MINUTES * 60 * 1000;

    return verificationExpiry >= Date.now();
  }

  private async resolveUserFromResetToken(
    resetToken: string,
    email?: string,
  ): Promise<User | null> {
    let payload: { sub?: string; email?: string; purpose?: string };

    try {
      payload = this.jwtService.verify(resetToken);
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (payload.purpose !== 'password-reset' || !payload.sub) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (email && payload.email !== email) {
      throw new BadRequestException('Email does not match reset token');
    }

    const user = await this.findUserWithResetFields({ id: payload.sub });
    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    if (!this.isResetVerificationValid(user)) {
      throw new BadRequestException('Reset verification expired or not completed');
    }

    return user;
  }
}
