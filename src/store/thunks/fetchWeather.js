import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWeatherForecast } from "../../api/weatherApi";

/* Async thunk with idle / loading / succeeded / failed request states. */
export const fetchWeather = createAsyncThunk(
  "weather/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchWeatherForecast();
    } catch (error) {
      return rejectWithValue(error.message || "Unable to load weather right now.");
    }
  }
);

export default fetchWeather;
