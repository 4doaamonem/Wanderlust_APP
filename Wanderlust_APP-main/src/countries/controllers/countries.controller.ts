import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CountriesService } from '../services/countries.service';
import { CountryDto } from '../dtos/country.dto';
import type { CountryData } from '../interfaces/country.interface';

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all countries' })
  @ApiResponse({
    status: 200,
    description: 'List of countries retrieved successfully',
    type: [CountryDto],
  })
  findAll(): CountryData[] {
    return this.countriesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get country details by slug' })
  @ApiParam({
    name: 'slug',
    description: 'Country slug (e.g., egypt, france, turkey)',
  })
  @ApiResponse({
    status: 200,
    description: 'Country details retrieved successfully',
    type: CountryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Country not found',
  })
  findOne(@Param('slug') slug: string): CountryData {
    return this.countriesService.findOne(slug);
  }
}
