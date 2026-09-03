import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CountriesModule } from './countries/countries.module';
import { WeatherModule } from './weather/weather.module';
import { CurrencyModule } from './currency/currency.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { PaymentModule } from './payment/payment.module';
import { PremiumModule } from './premium/premium.module';
import { ProfileModule } from './profile/profile.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { HotelsModule } from './hotels/hotels.module';
import { PopularPlacesModule } from './popular-places/popular-places.module';
import { PlansModule } from './plans/plans.module';
import { LoggerModule } from './logger/logger.module';
import { getDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: getDatabaseConfig,
    }),
    LoggerModule, // Global Logger Module
    UsersModule,
    AuthModule,
    CountriesModule,
    WeatherModule,
    CurrencyModule,
    PlansModule,
    SubscriptionsModule,
    PaymentModule,
    PremiumModule,
    ProfileModule,
    RestaurantsModule,
    HotelsModule,
    PopularPlacesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
