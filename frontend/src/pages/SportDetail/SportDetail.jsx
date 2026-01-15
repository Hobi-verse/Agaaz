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
          <p>The sport you're looking for doesn't exist or rules are not available yet.</p>
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
            <span onClick={() => navigate("/")} className="breadcrumb-link">Home</span>
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
        <div className="eligibility-grid">
          {Object.entries(rules.eligibility).map(([key, value]) => (
            <div key={key} className="eligibility-card">
              <div className="eligibility-label">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
              <div className="eligibility-value">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Rules Section */}
      <section className="sport-section rules-section">
        <div className="section-header">
          <h2 className="section-title">Rules & Regulations</h2>
        </div>
        <div className="rules-container">
          {rules.rules.map((ruleCategory, index) => (
            <div key={index} className="rule-category">
              <h3 className="rule-category-title">
                <span className="rule-number">{index + 1}</span>
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
      </section>

      {/* Penalties Section */}
      <section className="sport-section penalties-section">
        <div className="section-header">
          <h2 className="section-title">Penalties & Violations</h2>
        </div>
        <div className="penalties-list">
          {rules.penalties.map((penalty, index) => (
            <div key={index} className="penalty-item">
              <span className="penalty-text">{penalty}</span>
            </div>
          ))}
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
      </section>

      {/* CTA Section */}
      <section className="sport-cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Compete?</h2>
          <p className="cta-description">Register now and showcase your skills in {rules.name}!</p>
          <div className="cta-buttons">
            <Button 
              className="register-btn" 
              onClick={() => navigate("/register")}
            >
              Register Now
            </Button>
            <Button 
              className="back-btn" 
              onClick={() => navigate("/")}
            >
              Back to Sports
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
