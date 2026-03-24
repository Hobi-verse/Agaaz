import "./FormFields.css";

const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  maxLength,
  helpText,
}) => {
  return (
    <div className="formField">
      <label htmlFor={name} className="formFieldLabel">
        {label}
        {required && <span className="formFieldRequired"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className={`formFieldControl${error ? " formFieldControl--error" : ""}`}
      />

      {helpText && !error && (
        <small className="formFieldHint">{helpText}</small>
      )}

      {error && <small className="formFieldError">{error}</small>}
    </div>
  );
};

export default FormInput;
