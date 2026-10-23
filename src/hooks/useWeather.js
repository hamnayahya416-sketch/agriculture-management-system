import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeather } from "../store/thunks/fetchWeather";
import { selectWeatherState } from "../store/selectors/entitySelectors";

export const WEATHER_REFRESH_MS = 10 * 60 * 1000; // fixed auto-refresh interval: 10 minutes

/* Loads weather, auto-refreshes on a fixed interval, exposes request states. */
export default function useWeather(refreshMs = WEATHER_REFRESH_MS) {
  const dispatch = useDispatch();
  const weather = useSelector(selectWeatherState);

  const refresh = useCallback(() => dispatch(fetchWeather()), [dispatch]);

  useEffect(() => {
    let interval = null;
    refresh();
    if (refreshMs > 0) {
      interval = setInterval(refresh, refreshMs);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [refresh, refreshMs]);

  return {
    status: weather.status,
    data: weather.data,
    error: weather.error,
    lastUpdated: weather.lastUpdated,
    isLoading: weather.status === "loading",
    isIdle: weather.status === "idle",
    isFailed: weather.status === "failed",
    refresh,
  };
}
