import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { Weather, OpenWeatherResponse } from '../interfaces/weather.interface';

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/weather';

  // Mock weather data for demonstration
  private readonly mockWeatherData: Record<string, Weather> = {
    egypt: {
      temperature: 32,
      description: 'clear sky',
      humidity: 25,
      windSpeed: 3.2,
      country: 'EG',
      city: 'Cairo'
    },
    france: {
      temperature: 18,
      description: 'partly cloudy',
      humidity: 62,
      windSpeed: 4.8,
      country: 'FR',
      city: 'Paris'
    },
    turkey: {
      temperature: 24,
      description: 'scattered clouds',
      humidity: 45,
      windSpeed: 3.6,
      country: 'TR',
      city: 'Ankara'
    }
  };

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY') || '';
  }

  async getWeatherByCountry(country: string): Promise<Weather> {
    // If API key is provided, use real API
    if (this.apiKey && this.apiKey !== 'demo_key') {
      return this.getRealWeatherData(country);
    }

    // Otherwise use mock data
    return this.getMockWeatherData(country);
  }

  private async getRealWeatherData(country: string): Promise<Weather> {
    try {
      const url = `${this.baseUrl}?q=${encodeURIComponent(country)}&appid=${this.apiKey}&units=metric`;
      const response = await firstValueFrom(
        this.httpService.get<OpenWeatherResponse>(url)
      );
      
      if (!response.data) {
        throw new NotFoundException(`Weather data for '${country}' not found`);
      }

      return this.mapToWeather(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Country '${country}' not found or no weather data available`);
      }
      
      if (error.response?.status === 401) {
        throw new InternalServerErrorException('Invalid weather API key');
      }
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new InternalServerErrorException(`Failed to fetch weather data: ${error.message}`);
    }
  }

  private getMockWeatherData(country: string): Weather {
    const normalizedCountry = country.toLowerCase().trim();
    
    // Try to find exact match first
    if (this.mockWeatherData[normalizedCountry]) {
      return { ...this.mockWeatherData[normalizedCountry] };
    }

    // Try partial match
    const mockEntry = Object.entries(this.mockWeatherData).find(([key]) =>
      key.includes(normalizedCountry) || normalizedCountry.includes(key)
    );

    if (mockEntry) {
      return { ...mockEntry[1] };
    }

    // Return default mock data if no match found
    return {
      temperature: 20,
      description: 'scattered clouds',
      humidity: 60,
      windSpeed: 3.5,
      country: 'Unknown',
      city: country.charAt(0).toUpperCase() + country.slice(1)
    };
  }

  private mapToWeather(openWeatherData: OpenWeatherResponse): Weather {
    return {
      temperature: Math.round(openWeatherData.main?.temp || 0),
      description: openWeatherData.weather?.[0]?.description || 'No description available',
      humidity: openWeatherData.main?.humidity || 0,
      windSpeed: openWeatherData.wind?.speed || 0,
      country: openWeatherData.sys?.country || '',
      city: openWeatherData.name || ''
    };
  }
}
