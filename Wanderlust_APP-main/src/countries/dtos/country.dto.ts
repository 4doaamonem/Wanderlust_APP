import { ApiProperty } from '@nestjs/swagger';

export class CountryPlaceDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pyramids of Giza' })
  name: string;

  @ApiProperty({ example: 'country/egypt/places/place-1.jpg' })
  image: string;

  @ApiProperty({ example: 'https://en.wikipedia.org/wiki/Giza_pyramid_complex' })
  link: string;
}

export class CountryHotelDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 4.8 })
  rating: number;

  @ApiProperty({ example: '$250/night' })
  price: string;

  @ApiProperty({ example: 'https://www.fourseasons.com/cairo' })
  link: string;

  @ApiProperty({ example: 'Four Seasons Hotel Cairo' })
  name: string;

  @ApiProperty({ example: 'country/egypt/hotels/hotel-1.jpg' })
  image: string;
}

export class CountryRestaurantDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 4 })
  stars: number;

  @ApiProperty({ example: 'Khan el-Khalili Restaurant' })
  name: string;

  @ApiProperty({ example: 'country/egypt/restaurants/restaurant-1.jpg' })
  image: string;

  @ApiProperty({ example: 'Khan el-Khalili, Cairo' })
  location: string;

  @ApiProperty({ example: 'Traditional Egyptian' })
  kindOfFood: string;

  @ApiProperty({ example: 'https://www.instagram.com/khanelkhalilirestaurant' })
  instagram: string;
}

export class CountryDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'egypt' })
  slug: string;

  @ApiProperty({ example: 'Egypt' })
  title: string;

  @ApiProperty({ example: 'Where ancient wonders meet modern magic' })
  subtitle: string;

  @ApiProperty({ example: 'from-amber-900/80 via-orange-900/60 to-transparent' })
  overlay: string;

  @ApiProperty({ example: '24°C' })
  temperature: string;

  @ApiProperty({ example: 'Sunny' })
  weather: string;

  @ApiProperty({ example: 'Cairo' })
  city: string;

  @ApiProperty({ example: 'EGP' })
  currency: string;

  @ApiProperty({ example: ['Pyramids', 'Nile Cruise', 'Red Sea'] })
  highlights: string[];

  @ApiProperty({ example: ['country/egypt/landmarks/landmark-1.jpg'] })
  images: string[];

  @ApiProperty({ type: [CountryPlaceDto] })
  places: CountryPlaceDto[];

  @ApiProperty({ type: [CountryHotelDto] })
  hotels: CountryHotelDto[];

  @ApiProperty({ type: [CountryRestaurantDto] })
  restaurants: CountryRestaurantDto[];
}
