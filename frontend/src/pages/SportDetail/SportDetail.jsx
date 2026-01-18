import { useParams, useNavigate } from "react-router-dom";
import { getRulesBySportId } from "../../data/rulesData";
import Button from "../../components/Button";
import "./SportDetail.css";
import { useEffect } from "react";

export default function SportDetail() {
  const { sportId } = useParams();
  const navigate = useNavigate();
  const rules = getRulesBySportId(sportId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!rules) {
    return (
      <div className="sport-detail-container">
        <div className="sport-not-found">
          <h1>Sport Not Found</h1>
          <p>
            The sport you're looking for doesn't exist or rules are not
            available yet.
          </p>
          <Button onClick={() => navigate("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="sport-detail-container">
      {/* Hero Section */}
      <section className="sport-hero">
        <div className="sport-hero-content">
          <div className="sport-breadcrumb">
            <span onClick={() => navigate("/")} className="breadcrumb-link">
              Home
            </span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">{rules.name}</span>
          </div>
          <h1 className="sport-title">{rules.name}</h1>
          <p className="sport-category">{rules.category}</p>
          <p className="sport-overview">{rules.overview}</p>
          <div className="sport-fee-badge">
            Registration Fee: ₹{rules.registrationFee}
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section className="sport-section eligibility-section">
        <div className="section-header">
          <h2 className="section-title">Eligibility Criteria</h2>
        </div>
        <dl className="eligibility-list">
          {Object.entries(rules.eligibility).map(([key, value]) => (
            <div key={key} className="eligibility-item">
              <dt className="eligibility-label">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </dt>
              <dd className="eligibility-value">{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Rules + Penalties (single container) */}
      <section className="sport-section rulesPenalties-section">
        <div className="rulesPenaltiesPanel">
          <div className="rulesPenaltiesBlock">
            <div className="section-header rulesPenaltiesHeader">
              <h2 className="section-title">Rules & Regulations</h2>
            </div>
            <div className="rules-container">
              {rules.rules.map((ruleCategory, index) => (
                <div key={index} className="rule-category">
                  <h3 className="rule-category-title">
                    <span className="rule-number">{index + 1}.</span>
                    {ruleCategory.title}
                  </h3>
                  <ul className="rule-points">
                    {ruleCategory.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="rule-point">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rulesPenaltiesDivider"
            role="separator"
            aria-hidden="true"
          />

          <div className="rulesPenaltiesBlock">
            <div className="section-header rulesPenaltiesHeader">
              <h2 className="section-title">Penalties & Violations</h2>
            </div>
            <ul className="penalties-list">
              {rules.penalties.map((penalty, index) => (
                <li key={index} className="penalty-item">
                  {penalty}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Tournament Format Section */}
      <section className="sport-section format-section">
        <div className="section-header">
          <h2 className="section-title">Tournament Format</h2>
        </div>

        <div className="format-content">
          <p className="format-description">{rules.format}</p>
        </div>

        <div>
          <h2 className="py-3 section-title">For any queries contact us:</h2>
        </div>

        <div>
          <p className="format-description">{rules.support}</p>
        </div>
      </section>

      <div className="sportActions" aria-label="Page actions">
        <Button
          className="sportActionPrimary"
          onClick={() => navigate("/register")}
        >
          Register Now
        </Button>
        <Button
          className="sportActionSecondary"
          onClick={() => navigate("/sports")}
        >
          Back to Sports
        </Button>
      </div>
    </div>
  );
}
