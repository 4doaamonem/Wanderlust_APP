import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PopularPlacesService } from '../services/popular-places.service';
import { PopularPlaceDto } from '../dto/popular-place.dto';

@ApiTags('popular-places')
@Controller('popular-places')
export class PopularPlacesController {
  constructor(private readonly popularPlacesService: PopularPlacesService) {}

  @Get()
  @ApiOperation({ summary: 'Get popular places by country' })
  @ApiQuery({ 
    name: 'country', 
    required: false, 
    description: 'Filter popular places by country (egypt, france, turkey)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Popular places retrieved successfully',
    type: [PopularPlaceDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No popular places found for the specified country' 
  })
  async getPopularPlaces(@Query('country') country?: string): Promise<PopularPlaceDto[]> {
    try {
      if (country) {
        return await this.popularPlacesService.getPopularPlacesByCountry(country);
      }
      return await this.popularPlacesService.getAllPopularPlaces();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch popular places',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
