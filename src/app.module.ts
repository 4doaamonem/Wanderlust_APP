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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'wanderlust_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryAttempts: 3,
      retryDelay: 3000,
      logging: false,
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
