import { useSelector } from "react-redux";
import { selectAllCrops } from "../store/selectors/cropSelectors";
import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import Progress from "../common/Progress";
import StatusBadge from "../common/StatusBadge";

export default function CropHealthList() {
  const crops = useSelector(selectAllCrops);

  return (
    <Card
      title="Crop Health"
      subtitle="Health score and status for every crop"
      action={<StatusBadge>{crops.length} crops</StatusBadge>}
    >
      {crops.length === 0 ? (
        <EmptyState title="No crops yet" text="Add crops to see their health here." />
      ) : (
        <div className="production-list">
          {crops.map((crop) => (
            <div className="production-row" key={crop.id}>
              <div className="production-row__top">
                <span className="cell-title">{crop.name}</span>
                <StatusBadge>{crop.status}</StatusBadge>
              </div>
              <Progress
                value={crop.healthScore}
                label={`Health ${crop.healthScore}%`}
              />
              <span className="cell-sub">
                {crop.field} · cutting {crop.cuttingDate}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
