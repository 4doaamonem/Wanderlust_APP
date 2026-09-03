export interface Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  country: string;
  city: string;
}

export interface OpenWeatherResponse {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  name: string;
  sys: {
    country: string;
  };
}
