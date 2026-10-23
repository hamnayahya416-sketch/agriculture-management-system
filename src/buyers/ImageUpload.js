import { useRef, useState } from "react";
import { validateImage } from "../utils/validators";
import { IconImage, IconUpload } from "../common/icons";

/* JPG/PNG only, max 1 MB, live preview, stored as Base64. */
export default function ImageUpload({ value, onChange, error }) {
  const inputRef = useRef(null);
  const [internalError, setInternalError] = useState(null);
  const [fileName, setFileName] = useState("");

  function handleFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const message = validateImage(file);
    if (message) {
      setInternalError(message);
      onChange(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setInternalError(null);
      setFileName(file.name);
      onChange(reader.result);
    };
    reader.onerror = () => {
      setInternalError("Could not read that file. Please try another image.");
      onChange(null);
    };
    reader.readAsDataURL(file);
  }

  function clear() {
    setInternalError(null);
    setFileName("");
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const message = internalError || error || null;

  return (
    <div className="upload">
      <span className="upload__title">Buyer photo * (JPG/PNG, max 1 MB)</span>

      {value ? (
        <div className="upload__preview">
          <img src={value} alt="Buyer preview" />
          <div>
            <strong>{fileName || "Uploaded photo"}</strong>
            <button type="button" onClick={clear}>
              Remove image
            </button>
          </div>
        </div>
      ) : (
        <label className="upload__box">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleFile}
          />
          <IconUpload size={18} />
          <span>Click to choose a photo from your computer</span>
        </label>
      )}

      {message && <em className="upload__error">{message}</em>}
      {!message && value && (
        <span className="cell-sub">
          <IconImage size={13} /> Stored as Base64 and survives a refresh.
        </span>
      )}
    </div>
  );
}
