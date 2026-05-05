import { ApiProperty } from '@nestjs/swagger';

export class CurrencyDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  symbol: string;
}

export class FlagsDto {
  @ApiProperty()
  png: string;

  @ApiProperty()
  svg: string;

  @ApiProperty()
  alt: string;
}

export class CountryDto {
  @ApiProperty({ example: 'Egypt' })
  commonName: string;

  @ApiProperty({ example: 'Arab Republic of Egypt' })
  officialName: string;

  @ApiProperty({ example: ['Cairo'] })
  capital: string[];

  @ApiProperty({ example: 'Africa' })
  region: string;

  @ApiProperty({ example: 'Northern Africa' })
  subregion: string;

  @ApiProperty({ example: 102332403 })
  population: number;

  @ApiProperty({ type: FlagsDto })
  flags: FlagsDto;

  @ApiProperty({ type: 'object', additionalProperties: { type: 'object' } })
  currencies: Record<string, CurrencyDto>;

  @ApiProperty({ example: { 'ara': 'Arabic' }, type: 'object', additionalProperties: { type: 'string' } })
  languages: Record<string, string>;

  @ApiProperty({ example: ['UTC+02:00'] })
  timezones: string[];

  @ApiProperty({ example: ['ISR', 'LBY', 'SDN'] })
  borders: string[];
}
