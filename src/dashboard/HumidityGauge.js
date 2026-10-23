import { useSelector } from "react-redux";
import { selectHumidity, selectHumidityLevel } from "../store/selectors/weatherSelectors";
import Loader from "../common/Loader";

export default function HumidityGauge() {
  const humidity = useSelector(selectHumidity);
  const level = useSelector(selectHumidityLevel);

  if (humidity === null || humidity === undefined) {
    return <Loader label="Loading humidity…" />;
  }

  const angle = Math.max(0, Math.min(100, level.percent)) * 3.6;

  return (
    <div className={`humidity-gauge humidity-gauge--${level.tone}`}>
      <div
        className="humidity-gauge__dial"
        style={{ "--gauge-angle": `${angle}deg` }}
        role="img"
        aria-label={`Humidity ${humidity} percent, ${level.label}`}
      >
        <div className="humidity-gauge__inner">
          <strong>{humidity}%</strong>
          <span>humidity</span>
        </div>
      </div>
      <div className="humidity-gauge__meta">
        <span className={`badge badge--${level.tone}`}>{level.label}</span>
        <p className="cell-sub">
          {level.label === "Optimal"
            ? "Conditions are ideal for crop growth."
            : level.label === "Low"
              ? "Consider irrigation to raise moisture."
              : "Watch for fungal disease in this humidity."}
        </p>
      </div>
    </div>
  );
}
