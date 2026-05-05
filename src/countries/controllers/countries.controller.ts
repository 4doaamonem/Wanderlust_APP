import { Controller, Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiProperty } from '@nestjs/swagger';
import { CountriesService } from '../services/countries.service';

// Simple DTO class for country response
class CountryResponseDto {
  @ApiProperty({ example: 'Egypt' })
  countryName: string;

  @ApiProperty({ example: 'EG' })
  countryCode: string;
}

@ApiTags('countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get countries list' })
  @ApiQuery({ 
    name: 'search', 
    required: false, 
    description: 'Search countries by name (e.g., Egypt)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of countries retrieved successfully',
    type: [CountryResponseDto]
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async getCountries(@Query('search') search?: string): Promise<CountryResponseDto[]> {
    try {
      return await this.countriesService.getCountries(search);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch countries',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get country details by name' })
  @ApiParam({ 
    name: 'name', 
    description: 'Country name (e.g., Egypt)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Country details retrieved successfully',
    type: CountryResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Country not found' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error' 
  })
  async getCountryByName(@Param('name') name: string): Promise<any> {
    try {
      return await this.countriesService.getCountryByName(name);
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException(
          error.message,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        error.message || 'Failed to fetch country',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
