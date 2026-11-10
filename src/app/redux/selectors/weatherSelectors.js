import { createSelector } from "@reduxjs/toolkit";

export const selectWeatherData = (state) => state.weather.data;
export const selectWeatherStatus = (state) => state.weather.status;
export const selectWeatherError = (state) => state.weather.error;
export const selectWeatherLastUpdated = (state) => state.weather.lastUpdated;

export const selectCurrentWeather = createSelector([selectWeatherData], (data) =>
  data ? data.current : null
);

export const selectForecast = createSelector([selectWeatherData], (data) =>
  data && Array.isArray(data.forecast) ? data.forecast : []
);

export const selectPlace = createSelector([selectWeatherData], (data) =>
  data ? data.place : ""
);

export const selectHumidity = createSelector([selectCurrentWeather], (current) =>
  current ? current.humidity : null
);

/* Colour-coded humidity level: Low / Optimal / High. */
export const selectHumidityLevel = createSelector([selectHumidity], (humidity) => {
  if (humidity === null || humidity === undefined) {
    return { label: "—", tone: "grey", percent: 0 };
  }
  if (humidity < 40) return { label: "Low", tone: "amber", percent: humidity };
  if (humidity <= 70) return { label: "Optimal", tone: "green", percent: humidity };
  return { label: "High", tone: "red", percent: humidity };
});
