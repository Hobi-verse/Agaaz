import { Link } from "react-router-dom";

export default function RegistrationTerms({ checked, onChange }) {
  return (
    <div
      className="termsCheckbox"
      style={{
        margin: "20px 0",
        padding: "16px",
        background: "rgba(255, 178, 74, 0.1)",
        border: "1px solid rgba(255, 178, 74, 0.3)",
        borderRadius: "10px",
      }}
    >
      <label
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          cursor: "pointer",
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          style={{
            width: "20px",
            height: "20px",
            marginTop: "2px",
            accentColor: "#ffb24a",
            cursor: "pointer",
          }}
        />
        <span>
          I have read and agree to the{" "}
          <Link
            to="/rules"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#ffb24a", textDecoration: "underline" }}
          >
            Rules & Regulations
          </Link>
          ,{" "}
          <Link
            to="/code-of-conduct"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#ffb24a", textDecoration: "underline" }}
          >
            Code of Conduct
          </Link>
          , and{" "}
          <Link
            to="/refund-policy"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#ffb24a", textDecoration: "underline" }}
          >
            Refund Policy
          </Link>{" "}
          of AAGAAZ 2026.
        </span>
      </label>
    </div>
  );
}
