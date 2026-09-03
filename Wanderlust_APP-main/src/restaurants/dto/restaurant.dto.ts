import { ApiProperty } from '@nestjs/swagger';

export class RestaurantDto {
  @ApiProperty({ example: 'Khan el-Khalili Restaurant' })
  name: string;

  @ApiProperty({ example: 4 })
  stars: number;

  @ApiProperty({ example: 'Egyptian' })
  nationality: string;

  @ApiProperty({ example: 'Traditional Egyptian' })
  kindOfFood: string;

  @ApiProperty({ example: 'https://example.com/khan-restaurant.jpg' })
  photo: string;

  @ApiProperty({ example: 'https://facebook.com/khanrestaurant' })
  socialMediaLink: string;
}
