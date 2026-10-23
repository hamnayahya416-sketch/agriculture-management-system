import { getJson } from "./apiClient";

/* Open-Meteo: free, key-less weather API. */
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

export const WEATHER_LOCATION = {
  name: "Green Valley Farms, Punjab",
  latitude: 31.5204,
  longitude: 74.3587,
};

const WMO_CODES = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Dense drizzle",
  61: "Light rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Freezing rain",
  67: "Heavy freezing rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Heavy showers",
  82: "Violent showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm",
};

function codeLabel(code) {
  if (code === null || code === undefined) return "Unknown";
  return WMO_CODES[code] || "Unknown";
}

function parseIsoDate(iso) {
  const [year, month, day] = String(iso).split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function dayLabel(iso) {
  return parseIsoDate(iso).toLocaleDateString("en-US", { weekday: "short" });
}

function buildQuery() {
  const params = new URLSearchParams({
    latitude: String(WEATHER_LOCATION.latitude),
    longitude: String(WEATHER_LOCATION.longitude),
    timezone: "auto",
    forecast_days: "5",
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weather_code",
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
  });
  return params.toString();
}

function num(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : fallback;
}

export function normalizeWeather(payload) {
  const current = payload && payload.current;
  const daily = payload && payload.daily;
  if (!current || !daily || !Array.isArray(daily.time)) {
    throw new Error("Weather service returned unexpected data.");
  }

  const rainChance = Number(
    Array.isArray(daily.precipitation_probability_max)
      ? daily.precipitation_probability_max[0]
      : 0
  );

  const forecast = daily.time.slice(0, 5).map((date, index) => ({
    date,
    day: dayLabel(date),
    condition: codeLabel((daily.weather_code || [])[index]),
    high: num((daily.temperature_2m_max || [])[index]),
    low: num((daily.temperature_2m_min || [])[index]),
    rain: Number.isFinite(Number((daily.precipitation_probability_max || [])[index]))
      ? Number((daily.precipitation_probability_max || [])[index])
      : 0,
  }));

  return {
    place: WEATHER_LOCATION.name,
    current: {
      temp: num(current.temperature_2m),
      feels: num(current.apparent_temperature),
      humidity: num(current.relative_humidity_2m),
      wind: num(current.wind_speed_10m),
      precipitation: Number(current.precipitation || 0),
      rainChance: Number.isFinite(rainChance) ? Math.round(rainChance) : 0,
      condition: codeLabel(current.weather_code),
    },
    forecast,
  };
}

export async function fetchWeatherForecast() {
  const payload = await getJson(`${FORECAST_URL}?${buildQuery()}`);
  return normalizeWeather(payload);
}
