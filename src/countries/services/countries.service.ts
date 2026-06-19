import { Injectable, NotFoundException } from '@nestjs/common';
import { countriesData } from '../countries-data';
import { CountryData } from '../interfaces/country.interface';

@Injectable()
export class CountriesService {
  findAll(): CountryData[] {
    return countriesData;
  }

  findOne(slug: string): CountryData {
    const country = countriesData.find(
      (item) => item.slug.toLowerCase() === slug.toLowerCase(),
    );

    if (!country) {
      throw new NotFoundException(`Country '${slug}' not found`);
    }

    return country;
  }
}
