import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { RestaurantsService } from '../services/restaurants.service';
import { RestaurantDto } from '../dto/restaurant.dto';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'Get restaurants by country' })
  @ApiQuery({ 
    name: 'country', 
    required: false, 
    description: 'Filter restaurants by country (egypt, france, turkey)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Restaurants retrieved successfully',
    type: [RestaurantDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No restaurants found for the specified country' 
  })
  async getRestaurants(@Query('country') country?: string): Promise<RestaurantDto[]> {
    try {
      if (country) {
        return await this.restaurantsService.getRestaurantsByCountry(country);
      }
      return await this.restaurantsService.getAllRestaurants();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch restaurants',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
