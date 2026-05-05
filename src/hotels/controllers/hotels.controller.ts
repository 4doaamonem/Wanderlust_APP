import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HotelsService } from '../services/hotels.service';
import { HotelDto } from '../dto/hotel.dto';

@ApiTags('hotels')
@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Get()
  @ApiOperation({ summary: 'Get hotels by country' })
  @ApiQuery({ 
    name: 'country', 
    required: false, 
    description: 'Filter hotels by country (egypt, france, turkey)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Hotels retrieved successfully',
    type: [HotelDto]
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No hotels found for the specified country' 
  })
  async getHotels(@Query('country') country?: string): Promise<HotelDto[]> {
    try {
      if (country) {
        return await this.hotelsService.getHotelsByCountry(country);
      }
      return await this.hotelsService.getAllHotels();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch hotels',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
