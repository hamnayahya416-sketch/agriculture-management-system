import { useSelector } from "react-redux";
import { selectForecast } from "../store/selectors/weatherSelectors";
import EmptyState from "../common/EmptyState";

export default function ForecastStrip() {
  const forecast = useSelector(selectForecast);

  if (!forecast.length) {
    return <EmptyState title="No forecast" text="Five-day forecast will appear here." />;
  }

  return (
    <div className="forecast">
      {forecast.map((day) => (
        <div className="forecast__day" key={day.date}>
          <strong>{day.day}</strong>
          <span className="cell-sub">{day.date.slice(5)}</span>
          <span className="forecast__cond">{day.condition}</span>
          <span className="forecast__temp">
            {day.high}° / {day.low}°
          </span>
          <span className="forecast__rain">{day.rain}% rain</span>
        </div>
      ))}
    </div>
  );
}
