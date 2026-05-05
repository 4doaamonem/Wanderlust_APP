import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PopularPlaceDto } from '../dto/popular-place.dto';

@Injectable()
export class PopularPlacesService {
  // Static data for Egypt, France, and Turkey
  private readonly popularPlacesData: Record<string, PopularPlaceDto[]> = {
    egypt: [
      {
        name: 'Pyramids of Giza',
        description: 'Ancient Egyptian pyramids and sphinx complex',
        photo: 'https://example.com/pyramids-giza.jpg'
      },
      {
        name: 'Luxor Temple',
        description: 'Ancient Egyptian temple complex on the east bank of the Nile',
        photo: 'https://example.com/luxor-temple.jpg'
      },
      {
        name: 'Abu Simbel Temples',
        description: 'Twin rock temples built by Pharaoh Ramesses II',
        photo: 'https://example.com/abu-simbel.jpg'
      }
    ],
    france: [
      {
        name: 'Eiffel Tower',
        description: 'Iconic iron lattice tower and symbol of France',
        photo: 'https://example.com/eiffel-tower.jpg'
      },
      {
        name: 'Louvre Museum',
        description: 'World\'s largest art museum and historic monument',
        photo: 'https://example.com/louvre-museum.jpg'
      },
      {
        name: 'Notre-Dame Cathedral',
        description: 'Medieval Catholic cathedral on the Île de la Cité',
        photo: 'https://example.com/notre-dame.jpg'
      }
    ],
    turkey: [
      {
        name: 'Hagia Sophia',
        description: 'Historic mosque and former cathedral in Istanbul',
        photo: 'https://example.com/hagia-sophia.jpg'
      },
      {
        name: 'Cappadocia',
        description: 'Historical region known for unique rock formations and hot air balloons',
        photo: 'https://example.com/cappadocia.jpg'
      },
      {
        name: 'Pamukkale',
        description: 'Natural site with hot springs and travertine terraces',
        photo: 'https://example.com/pamukkale.jpg'
      }
    ]
  };

  async getPopularPlacesByCountry(country: string): Promise<PopularPlaceDto[]> {
    const normalizedCountry = country.toLowerCase().trim();
    
    const places = this.popularPlacesData[normalizedCountry];
    if (!places) {
      throw new NotFoundException(`No popular places found for country: ${country}`);
    }
    
    return [...places];
  }

  async getAllPopularPlaces(): Promise<PopularPlaceDto[]> {
    const allPlaces: PopularPlaceDto[] = [];
    
    Object.values(this.popularPlacesData).forEach(countryPlaces => {
      allPlaces.push(...countryPlaces);
    });
    
    return allPlaces;
  }
}
