import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RestaurantsController } from './controllers/restaurants.controller';
import { RestaurantsService } from './services/restaurants.service';

@Module({
  imports: [HttpModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
})
export class RestaurantsModule {}
