import { ApiProperty } from '@nestjs/swagger';

export class WeatherDto {
  @ApiProperty({ example: 22.5, description: 'Temperature in Celsius' })
  temperature: number;

  @ApiProperty({ example: 'clear sky', description: 'Weather description' })
  description: string;

  @ApiProperty({ example: 65, description: 'Humidity percentage' })
  humidity: number;

  @ApiProperty({ example: 3.5, description: 'Wind speed in m/s' })
  windSpeed: number;

  @ApiProperty({ example: 'US', description: 'Country code' })
  country: string;

  @ApiProperty({ example: 'New York', description: 'City name' })
  city: string;
}
