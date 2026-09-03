import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WeatherService } from '../services/weather.service';
import { WeatherDto } from '../dtos/weather.dto';
import { Weather } from '../interfaces/weather.interface';

@ApiTags('weather')
@Controller('weather')
export class WeatherController {
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  @ApiOperation({ summary: 'Get weather information by country' })
  @ApiQuery({ 
    name: 'country', 
    required: true, 
    description: 'Country name (e.g., Egypt, United States)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Weather data retrieved successfully',
    type: WeatherDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Country not found or no weather data available' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error or API failure' 
  })
  async getWeather(@Query('country') country: string): Promise<Weather> {
    if (!country) {
      throw new HttpException(
        'Country parameter is required',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      return await this.weatherService.getWeatherByCountry(country);
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException(
          error.message,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        error.message || 'Failed to fetch weather data',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
