import { WEATHER_REQUEST, REQUEST, SUCCESS, FAILURE } from "../../utilities.js";
import * as api from "../../api/weather/index.js";

/* Every action creator is a thunk: (data, moveToNext, failure). */
export function FETCHWEATHER(data, moveToNext, failure) {
  return async (dispatch) => {
    try {
      dispatch(REQUEST(WEATHER_REQUEST.FETCH_REQUEST));
      const weather = await api.fetchWeatherForecast();
      dispatch(SUCCESS(WEATHER_REQUEST.FETCH_SUCCESS, weather));
      if (moveToNext) moveToNext(weather);
    } catch (err) {
      const message = err.message || "Unable to load weather right now.";
      dispatch(FAILURE(WEATHER_REQUEST.FETCH_FAILURE, message));
      if (failure) failure(message);
    }
  };
}
