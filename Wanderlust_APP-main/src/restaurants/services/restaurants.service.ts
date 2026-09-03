import { Injectable, NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RestaurantDto } from '../dto/restaurant.dto';

@Injectable()
export class RestaurantsService {
  // Static data for Egypt, France, and Turkey
  private readonly restaurantsData: Record<string, RestaurantDto[]> = {
    egypt: [
      {
        name: 'Khan el-Khalili Restaurant',
        stars: 4,
        nationality: 'Egyptian',
        kindOfFood: 'Traditional Egyptian',
        photo: 'https://example.com/khan-restaurant.jpg',
        socialMediaLink: 'https://facebook.com/khanrestaurant'
      },
      {
        name: 'Abou Tarek',
        stars: 4,
        nationality: 'Egyptian',
        kindOfFood: 'Koshary & Egyptian Street Food',
        photo: 'https://example.com/abou-tarek.jpg',
        socialMediaLink: 'https://instagram.com/aboutarek'
      },
      {
        name: 'Sequoia Restaurant',
        stars: 5,
        nationality: 'Egyptian',
        kindOfFood: 'Mediterranean & Egyptian Fusion',
        photo: 'https://example.com/sequoia.jpg',
        socialMediaLink: 'https://facebook.com/sequoiarestaurant'
      }
    ],
    france: [
      {
        name: 'Le Bernardin',
        stars: 5,
        nationality: 'French',
        kindOfFood: 'French Fine Dining',
        photo: 'https://example.com/le-bernardin.jpg',
        socialMediaLink: 'https://facebook.com/lebernardin'
      },
      {
        name: 'L\'Ami Jean',
        stars: 4,
        nationality: 'French',
        kindOfFood: 'Traditional French Bistro',
        photo: 'https://example.com/lami-jean.jpg',
        socialMediaLink: 'https://instagram.com/lamijean'
      },
      {
        name: 'Le Comptoir du Relais',
        stars: 4,
        nationality: 'French',
        kindOfFood: 'French Bistro Cuisine',
        photo: 'https://example.com/comptoir-relais.jpg',
        socialMediaLink: 'https://facebook.com/comptoirrelais'
      }
    ],
    turkey: [
      {
        name: 'Ciğerci Arif',
        stars: 4,
        nationality: 'Turkish',
        kindOfFood: 'Traditional Turkish Kebab',
        photo: 'https://example.com/cigerci-arif.jpg',
        socialMediaLink: 'https://instagram.com/cigerciarif'
      },
      {
        name: 'Hamdi Restaurant',
        stars: 4,
        nationality: 'Turkish',
        kindOfFood: 'Ottoman & Turkish Cuisine',
        photo: 'https://example.com/hamdi.jpg',
        socialMediaLink: 'https://facebook.com/hamdirestaurant'
      },
      {
        name: 'Mikla Restaurant',
        stars: 5,
        nationality: 'Turkish',
        kindOfFood: 'Modern Turkish with Scandinavian Touch',
        photo: 'https://example.com/mikla.jpg',
        socialMediaLink: 'https://instagram.com/mikla'
      }
    ]
  };

  async getRestaurantsByCountry(country: string): Promise<RestaurantDto[]> {
    const normalizedCountry = country.toLowerCase().trim();
    
    const restaurants = this.restaurantsData[normalizedCountry];
    if (!restaurants) {
      throw new NotFoundException(`No restaurants found for country: ${country}`);
    }
    
    return [...restaurants];
  }

  async getAllRestaurants(): Promise<RestaurantDto[]> {
    const allRestaurants: RestaurantDto[] = [];
    
    Object.values(this.restaurantsData).forEach(countryRestaurants => {
      allRestaurants.push(...countryRestaurants);
    });
    
    return allRestaurants;
  }
}
