import axios from 'axios';
import { WEATHER_API_KEY } from '@/config';

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const getWeatherData = async (location: string) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          q: location,
          appid: WEATHER_API_KEY,
          units: 'metric',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch weather data');
    }
  };
  
  export const getWeather = async (location: string) => {
    const data = await getWeatherData(location);
    const weather = {
      temperature: data.main.temp,
      state: data.weather[0].main,
      icon: data.weather[0].icon,
    };
    return weather;
  };
