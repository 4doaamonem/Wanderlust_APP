import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Country, RestCountryResponse } from '../interfaces/country.interface';

@Injectable()
export class CountriesService {
  private readonly baseUrl = 'https://restcountries.com/v3.1';

  // Mock country data for demonstration
  private readonly mockCountriesData = [
    {
      countryName: 'Egypt',
      countryCode: 'EG'
    },
    {
      countryName: 'France',
      countryCode: 'FR'
    },
    {
      countryName: 'Turkey',
      countryCode: 'TR'
    }
  ];

  constructor(private readonly httpService: HttpService) {}

  async getCountries(search?: string): Promise<{ countryName: string; countryCode: string }[]> {
    if (search) {
      return this.searchCountriesByName(search);
    }
    
    return this.getDefaultCountries();
  }

  async getCountryByName(name: string): Promise<any> {
    // Try real API first
    return this.getRealCountryData(name);
  }

  private async searchCountriesByName(name: string): Promise<{ countryName: string; countryCode: string }[]> {
    const normalizedSearch = name.toLowerCase().trim();
    const results: { countryName: string; countryCode: string }[] = [];

    // Search through mock data by both countryName and countryCode
    this.mockCountriesData.forEach(country => {
      if (country.countryName.toLowerCase().includes(normalizedSearch) || 
          country.countryCode.toLowerCase().includes(normalizedSearch)) {
        results.push({ ...country });
      }
    });

    return results;
  }

  private getDefaultCountries(): Promise<{ countryName: string; countryCode: string }[]> {
    // Return the three mock countries mapped to the required structure
    return Promise.resolve(this.mockCountriesData.map(country => ({ ...country })));
  }

  private getMockCountryData(name: string): any {
    const normalizedName = name.toLowerCase().trim();
    
    // Mock full country data with all required fields
    const mockFullData: Record<string, any> = {
      egypt: {
        name: {
          common: 'Egypt',
          official: 'Arab Republic of Egypt'
        },
        capital: ['Cairo'],
        capitalInfo: {
          latlng: [30.0444, 31.2357]
        },
        region: 'Africa',
        subregion: 'Northern Africa',
        population: 102332403,
        borders: ['ISR', 'LBY', 'SDN'],
        languages: {
          ara: 'Arabic'
        },
        currencies: {
          EGP: {
            name: 'Egyptian pound',
            symbol: '£'
          }
        },
        timezones: ['UTC+02:00'],
        continents: ['Africa'],
        visaRequired: false
      },
      france: {
        name: {
          common: 'France',
          official: 'French Republic'
        },
        capital: ['Paris'],
        capitalInfo: {
          latlng: [48.8566, 2.3522]
        },
        region: 'Europe',
        subregion: 'Western Europe',
        population: 67391582,
        borders: ['BEL', 'DEU', 'ITA', 'LUX', 'ESP', 'CHE'],
        languages: {
          fra: 'French'
        },
        currencies: {
          EUR: {
            name: 'Euro',
            symbol: '€'
          }
        },
        timezones: ['UTC+01:00'],
        continents: ['Europe'],
        visaRequired: false
      },
      turkey: {
        name: {
          common: 'Turkey',
          official: 'Republic of Turkey'
        },
        capital: ['Ankara'],
        capitalInfo: {
          latlng: [39.9334, 32.8597]
        },
        region: 'Asia',
        subregion: 'Western Asia',
        population: 84339067,
        borders: ['ARM', 'AZE', 'BGR', 'GEO', 'GRC', 'IRN', 'IRQ', 'SYR'],
        languages: {
          tur: 'Turkish'
        },
        currencies: {
          TRY: {
            name: 'Turkish lira',
            symbol: '₺'
          }
        },
        timezones: ['UTC+03:00'],
        continents: ['Asia'],
        visaRequired: false
      }
    };
    
    // Try to find exact match by countryName or countryCode
    const foundCountry = Object.entries(mockFullData).find(([key, data]) =>
      key.includes(normalizedName) || 
      data.name.common.toLowerCase().includes(normalizedName) ||
      normalizedName.includes(key)
    );

    if (foundCountry) {
      return { ...foundCountry[1] };
    }

    throw new NotFoundException(`Country '${name}' not found`);
  }

  private async getRealCountryData(name: string): Promise<any> {
    try {
      const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(name)}?fullText=false`;
      const response = await firstValueFrom(
        this.httpService.get(url)
      );
      
      if (!response.data || response.data.length === 0) {
        throw new NotFoundException(`Country '${name}' not found`);
      }

      const country = response.data[0];
      
      return {
        name: {
          common: country.name?.common || '',
          official: country.name?.official || ''
        },
        capital: country.capital || [],
        capitalInfo: {
          latlng: country.capitalInfo?.latlng || []
        },
        region: country.region || '',
        subregion: country.subregion || '',
        population: country.population || 0,
        borders: country.borders || [],
        languages: country.languages || {},
        currencies: country.currencies || {},
        timezones: country.timezones || [],
        continents: country.continents || [],
        visaRequired: false // Default to false for our countries
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException(`Country '${name}' not found`);
      }
      
      // Fallback to mock data if API fails
      return this.getMockCountryData(name);
    }
  }

  private mapToCountry(restCountry: RestCountryResponse): Country {
    return {
      commonName: restCountry.name?.common || '',
      officialName: restCountry.name?.official || '',
      capital: restCountry.capital || [],
      region: restCountry.region || '',
      subregion: restCountry.subregion || '',
      population: restCountry.population || 0,
      flags: restCountry.flags || { png: '', svg: '', alt: '' },
      currencies: restCountry.currencies || {},
      languages: restCountry.languages || {},
      timezones: restCountry.timezones || [],
      borders: restCountry.borders || []
    };
  }
}
