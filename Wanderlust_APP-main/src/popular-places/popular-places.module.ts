import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PopularPlacesController } from './controllers/popular-places.controller';
import { PopularPlacesService } from './services/popular-places.service';

@Module({
  imports: [HttpModule],
  controllers: [PopularPlacesController],
  providers: [PopularPlacesService],
})
export class PopularPlacesModule {}
