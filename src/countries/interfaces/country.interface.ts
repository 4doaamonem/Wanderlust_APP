export interface CountryPlace {
  id: number;
  name: string;
  image: string;
  link: string;
}

export interface CountryHotel {
  id: number;
  rating: number;
  price: string;
  link: string;
  name: string;
  image: string;
}

export interface CountryRestaurant {
  id: number;
  stars: number;
  name: string;
  image: string;
  location: string;
  kindOfFood: string;
  instagram: string;
}

export interface CountryData {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  overlay: string;
  temperature: string;
  weather: string;
  city: string;
  currency: string;
  highlights: string[];
  images: string[];
  places: CountryPlace[];
  hotels: CountryHotel[];
  restaurants: CountryRestaurant[];
}
