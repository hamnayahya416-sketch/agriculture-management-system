import { useSelector } from "react-redux";
import useWeather from "../../hooks/useWeather.js";
import { selectPlace } from "../../redux/selectors/weatherSelectors.js";
import { formatTimestamp } from "../../utils/formatters.js";
import Card from "../common/Card.js";
import Loader from "../common/Loader.js";
import HumidityGauge from "./HumidityGauge.js";
import ForecastStrip from "./ForecastStrip.js";
import {
  IconAlert,
  IconCloudSun,
  IconDroplet,
  IconRefresh,
  IconThermo,
  IconWind,
} from "../common/icons.js";

export default function WeatherCard() {
  const place = useSelector(selectPlace);
  const { data, error, lastUpdated, isLoading, isIdle, isFailed, refresh } =
    useWeather();
  const current = data ? data.current : null;

  const action = (
    <div className="weather-actions">
      {lastUpdated && (
        <span className="cell-sub">Updated {formatTimestamp(lastUpdated)}</span>
      )}
      <button
        type="button"
        className="icon-btn"
        onClick={refresh}
        aria-label="Refresh weather"
        disabled={isLoading}
      >
        <IconRefresh size={17} />
      </button>
    </div>
  );

  if (isIdle || (isLoading && !current)) {
    return (
      <Card title="Live Weather" subtitle={place || "Open-Meteo"} action={action}>
        <Loader label="Fetching live weather…" />
      </Card>
    );
  }

  if (isFailed && !current) {
    return (
      <Card title="Live Weather" subtitle={place || "Open-Meteo"} action={action}>
        <div className="weather-error" role="alert">
          <IconAlert size={18} />
          <div>
            <b>Weather unavailable</b>
            <p>{error}</p>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={refresh}>
            Try again
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="Live Weather"
      subtitle={`${place} · Open-Meteo`}
      action={action}
    >
      {isLoading && <span className="weather-updating">Updating…</span>}
      {isFailed && (
        <p className="weather-stale">Showing last saved data — {error}</p>
      )}

      <div className="weather-now">
        <span className="weather-now__icon">
          <IconCloudSun size={24} />
        </span>
        <div>
          <div className="weather-now__temp">{current.temp}°C</div>
          <div className="weather-now__cond">{current.condition}</div>
        </div>
      </div>

      <div className="weather-facts">
        <div>
          <span>Humidity</span>
          <strong>{current.humidity}%</strong>
        </div>
        <div>
          <span>Wind</span>
          <strong>{current.wind} km/h</strong>
        </div>
        <div>
          <span>Rain chance</span>
          <strong>{current.rainChance}%</strong>
        </div>
        <div>
          <span>Feels like</span>
          <strong>{current.feels}°C</strong>
        </div>
      </div>

      <div className="weather-icons-row" aria-hidden="true">
        <IconThermo size={15} />
        <IconDroplet size={15} />
        <IconWind size={15} />
      </div>

      <h4 className="section-label">Humidity</h4>
      <HumidityGauge />

      <h4 className="section-label">5-day forecast</h4>
      <ForecastStrip />
    </Card>
  );
}
