import { ApiProperty } from '@nestjs/swagger';

export class ExchangeRatesDto {
  @ApiProperty({ example: 'USD' })
  baseCode: string;

  @ApiProperty({ example: { 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110.5 }, type: 'object', additionalProperties: { type: 'number' } })
  rates: Record<string, number>;
}

export class CurrencyConversionDto {
  @ApiProperty({ example: 'USD' })
  from: string;

  @ApiProperty({ example: 'EGP' })
  to: string;

  @ApiProperty({ example: 100 })
  amount: number;

  @ApiProperty({ example: 3100.50 })
  convertedAmount: number;

  @ApiProperty({ example: 31.005 })
  rate: number;
}

export class ConversionQueryDto {
  @ApiProperty({ example: 'USD', required: true })
  from: string;

  @ApiProperty({ example: 'EGP', required: true })
  to: string;

  @ApiProperty({ example: 100, required: true, type: 'number' })
  amount: number;
}
