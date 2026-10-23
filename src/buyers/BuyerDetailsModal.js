import { useEffect, useState } from "react";
import { formatDate, formatNumber } from "../utils/formatters";
import { formatCnic } from "../utils/validators";
import { IconClose } from "../common/icons";

export default function BuyerDetailsModal({ buyer, onClose }) {
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setZoomed(false);
    if (!buyer) return undefined;
    function onKeyDown(event) {
      if (event.key === "Escape" && onClose) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [buyer, onClose]);

  if (!buyer) return null;

  const rows = [
    ["Buyer ID", buyer.id],
    ["Full name", buyer.name],
    ["CNIC", formatCnic(buyer.cnic)],
    ["Crop", buyer.cropName || "—"],
    ["Quantity", `${formatNumber(buyer.quantity)} ${buyer.unit || "kg"}`],
    ["Purchase date", formatDate(buyer.date)],
  ];

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-label={`Buyer details — ${buyer.name}`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <h3>Buyer Details</h3>
          <button
            type="button"
            className="icon-btn"
            onClick={onClose}
            aria-label="Close buyer details"
          >
            <IconClose size={16} />
          </button>
        </div>

        <div className="buyer-details">
          <button
            type="button"
            className={`buyer-details__photo ${zoomed ? "is-zoomed" : ""}`.trim()}
            onClick={() => setZoomed((value) => !value)}
            title={zoomed ? "Click to shrink" : "Click to zoom"}
          >
            <img src={buyer.imageBase64} alt={`${buyer.name} profile`} />
          </button>

          <div className="buyer-details__info">
            <h4>{buyer.name}</h4>
            <p className="muted small">Click the photo to zoom</p>
            <dl className="details-grid">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="modal__actions">
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
