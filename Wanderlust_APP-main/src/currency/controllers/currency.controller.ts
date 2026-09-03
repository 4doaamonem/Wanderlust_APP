import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CurrencyService } from '../services/currency.service';
import { ExchangeRatesDto, CurrencyConversionDto, ConversionQueryDto } from '../dtos/currency.dto';
import { ExchangeRates, CurrencyConversion } from '../interfaces/currency.interface';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('rates/:baseCode')
  @ApiOperation({ summary: 'Get all exchange rates for a base currency' })
  @ApiParam({ 
    name: 'baseCode', 
    description: 'Base currency code (e.g., USD, EUR)' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Exchange rates retrieved successfully',
    type: ExchangeRatesDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Invalid currency code' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error or API failure' 
  })
  async getExchangeRates(@Param('baseCode') baseCode: string): Promise<ExchangeRates> {
    if (!baseCode) {
      throw new HttpException(
        'Base currency code is required',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      return await this.currencyService.getExchangeRates(baseCode);
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException(
          error.message,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        error.message || 'Failed to fetch exchange rates',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('convert')
  @ApiOperation({ summary: 'Convert amount from one currency to another' })
  @ApiQuery({ 
    name: 'from', 
    required: true, 
    description: 'Source currency code (e.g., USD)' 
  })
  @ApiQuery({ 
    name: 'to', 
    required: true, 
    description: 'Target currency code (e.g., EGP)' 
  })
  @ApiQuery({ 
    name: 'amount', 
    required: true, 
    type: 'number',
    description: 'Amount to convert' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Currency converted successfully',
    type: CurrencyConversionDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Missing or invalid parameters' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Invalid currency codes' 
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error or API failure' 
  })
  async convertCurrency(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('amount') amount: string
  ): Promise<CurrencyConversion> {
    if (!from || !to || !amount) {
      throw new HttpException(
        'All parameters (from, to, amount) are required',
        HttpStatus.BAD_REQUEST
      );
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      throw new HttpException(
        'Amount must be a positive number',
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      return await this.currencyService.convertCurrency(from, to, amountNumber);
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException(
          error.message,
          HttpStatus.NOT_FOUND
        );
      }
      
      throw new HttpException(
        error.message || 'Failed to convert currency',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
