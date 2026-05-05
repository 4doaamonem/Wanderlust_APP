import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CountriesController } from './controllers/countries.controller';
import { CountriesService } from './services/countries.service';

@Module({
  imports: [HttpModule],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
