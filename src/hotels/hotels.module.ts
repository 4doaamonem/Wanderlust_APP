import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HotelsController } from './controllers/hotels.controller';
import { HotelsService } from './services/hotels.service';

@Module({
  imports: [HttpModule],
  controllers: [HotelsController],
  providers: [HotelsService],
})
export class HotelsModule {}
