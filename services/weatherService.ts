import axios from "axios";
import { WEATHER_API_KEY } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const CACHE_DURATION = 30 * 60 * 1000;

const getWeatherData = async (location: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: location,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch weather data");
  }
};

const cacheWeatherData = async (location: string, data: any) => {
  const cacheEntry = {
    data,
    timestamp: Date.now(),
  };
  await AsyncStorage.setItem(`weather_${location}`, JSON.stringify(cacheEntry));
};

const getCachedWeatherData = async (location: string) => {
  const cacheEntry = await AsyncStorage.getItem(`weather_${location}`);
  if (cacheEntry) {
    const { data, timestamp } = JSON.parse(cacheEntry);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  return null;
};

export const getWeather = async (location: string) => {
  const cachedData = await getCachedWeatherData(location);
  if (cachedData) {
    return {
      temperature: cachedData.main.temp,
      state: cachedData.weather[0].main,
      icon: cachedData.weather[0].icon,
    };
  }

  const data = await getWeatherData(location);
  await cacheWeatherData(location, data);

  return {
    temperature: Math.round(data.main.temp),
    state: data.weather[0].main,
    icon: data.weather[0].icon,
  };
};
