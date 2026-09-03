import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { GoogleStrategy } from './google.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { EmailService } from './services/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, EmailService, JwtStrategy, GoogleStrategy, JwtAuthGuard],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
