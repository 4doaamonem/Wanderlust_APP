import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    console.log('JWT Strategy - constructor called');
    console.log('JWT Strategy - secretOrKey:', 'your-secret-key-change-in-production');
    console.log('JWT Strategy - jwtFromRequest:', ExtractJwt.fromAuthHeaderAsBearerToken());
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key-change-in-production',
    });
    
    console.log('JWT Strategy - constructor completed');
  }

  async validate(payload: any) {
    console.log('JWT Strategy - validate called with payload:', payload);
    const user = { userId: payload.sub, email: payload.email };
    console.log('JWT Strategy - returning user:', user);
    return user;
  }
}
