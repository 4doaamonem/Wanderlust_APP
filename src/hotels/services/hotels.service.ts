import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { HotelDto } from '../dto/hotel.dto';

@Injectable()
export class HotelsService {
  // Static data for Egypt, France, and Turkey
  private readonly hotelsData: Record<string, HotelDto[]> = {
    egypt: [
      {
        name: 'Four Seasons Hotel Cairo',
        stars: 5,
        location: 'Nile Corniche, Cairo',
        priceRange: 'Premium',
        photo: 'https://example.com/four-seasons-cairo.jpg',
        socialMediaLink: 'https://facebook.com/fourseasonscairo'
      },
      {
        name: 'The Nile Ritz-Carlton',
        stars: 5,
        location: 'Nile Corniche, Cairo',
        priceRange: 'Premium',
        photo: 'https://example.com/nile-ritz-carlton.jpg',
        socialMediaLink: 'https://facebook.com/nileritzcarlton'
      },
      {
        name: 'Marriott Mena House',
        stars: 5,
        location: 'Pyramids Road, Giza',
        priceRange: 'Premium',
        photo: 'https://example.com/marriott-mena-house.jpg',
        socialMediaLink: 'https://facebook.com/marriottmenahouse'
      }
    ],
    france: [
      {
        name: 'Four Seasons Hotel George V',
        stars: 5,
        location: 'Champs-Élysées, Paris',
        priceRange: 'Premium',
        photo: 'https://example.com/four-seasons-george-v.jpg',
        socialMediaLink: 'https://facebook.com/fourseasonsgeorgev'
      },
      {
        name: 'Le Meurice',
        stars: 5,
        location: 'Rue de Rivoli, Paris',
        priceRange: 'Premium',
        photo: 'https://example.com/le-meurice.jpg',
        socialMediaLink: 'https://facebook.com/lemeurice'
      },
      {
        name: 'Hotel Plaza Athénée',
        stars: 5,
        location: 'Avenue Montaigne, Paris',
        priceRange: 'Premium',
        photo: 'https://example.com/plaza-athenee.jpg',
        socialMediaLink: 'https://facebook.com/hotelplazaathenee'
      }
    ],
    turkey: [
      {
        name: 'Four Seasons Hotel Istanbul',
        stars: 5,
        location: 'Bosphorus, Istanbul',
        priceRange: 'Premium',
        photo: 'https://example.com/four-seasons-istanbul.jpg',
        socialMediaLink: 'https://facebook.com/fourseasonsistanbul'
      },
      {
        name: 'Çırağan Palace Kempinski',
        stars: 5,
        location: 'Bosphorus, Istanbul',
        priceRange: 'Premium',
        photo: 'https://example.com/ciragan-palace.jpg',
        socialMediaLink: 'https://facebook.com/ciraganpalace'
      },
      {
        name: 'Swissôtel The Bosphorus',
        stars: 5,
        location: 'Maçka, Istanbul',
        priceRange: 'Premium',
        photo: 'https://example.com/swissotel-bosphorus.jpg',
        socialMediaLink: 'https://facebook.com/swissotelbosphorus'
      }
    ]
  };

  async getHotelsByCountry(country: string): Promise<HotelDto[]> {
    const normalizedCountry = country.toLowerCase().trim();
    
    const hotels = this.hotelsData[normalizedCountry];
    if (!hotels) {
      throw new NotFoundException(`No hotels found for country: ${country}`);
    }
    
    return [...hotels];
  }

  async getAllHotels(): Promise<HotelDto[]> {
    const allHotels: HotelDto[] = [];
    
    Object.values(this.hotelsData).forEach(countryHotels => {
      allHotels.push(...countryHotels);
    });
    
    return allHotels;
  }
}
