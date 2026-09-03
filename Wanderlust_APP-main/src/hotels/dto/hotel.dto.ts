import { ApiProperty } from '@nestjs/swagger';

export class HotelDto {
  @ApiProperty({ example: 'Four Seasons Hotel Cairo' })
  name: string;

  @ApiProperty({ example: 5 })
  stars: number;

  @ApiProperty({ example: 'Nile Corniche, Cairo' })
  location: string;

  @ApiProperty({ example: 3, description: 'Hotel price range from 1 to 3' })
  priceRange: number;

  @ApiProperty({ example: 'https://example.com/four-seasons-cairo.jpg' })
  photo: string;

  @ApiProperty({ example: 'https://facebook.com/fourseasonscairo' })
  socialMediaLink: string;
}
