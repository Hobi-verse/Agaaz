import { useEffect, useRef, useState } from "react";

import "./FormFields.css";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

const FileUpload = ({ label, name, onChange, required = false, error }) => {
  const [preview, setPreview] = useState(null);
  const [localError, setLocalError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const validateFile = (file) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, or WEBP images are allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 1MB";
    }
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setLocalError(validationError);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setLocalError("");
    setPreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
      return URL.createObjectURL(file);
    });
    onChange({ target: { name, files: [file] } });
  };

  const handleRemove = () => {
    setPreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }
      return null;
    });
    setLocalError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    onChange({ target: { name, files: [] } });
  };

  const displayError = error || localError;

  return (
    <div className="formField">
      <label htmlFor={name} className="formFieldLabel">
        {label}
        {required && <span className="formFieldRequired"> *</span>}
      </label>

      {!preview ? (
        <div>
          <input
            id={name}
            ref={fileInputRef}
            type="file"
            name={name}
            accept={ALLOWED_TYPES.join(",")}
            onChange={handleFileChange}
            className="fileUploadInput"
          />
          <small className="formFieldHint">JPG, PNG, WEBP (Max 1MB)</small>
        </div>
      ) : (
        <div className="fileUploadPreview">
          <img src={preview} alt="Preview" className="fileUploadImage" />
          <button
            type="button"
            onClick={handleRemove}
            className="fileUploadRemove"
          >
            Remove
          </button>
        </div>
      )}

      {displayError && <small className="formFieldError">{displayError}</small>}
    </div>
  );
};

export default FileUpload;
