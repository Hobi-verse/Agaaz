import "./CodeOfConduct.css";

const codeOfConductRules = [
  "All participants must maintain discipline, decorum, and sportsmanship throughout the event.",
  "Misbehavior, abusive language, physical altercations, or disrespect towards officials, opponents, or volunteers will not be tolerated.",
  "Any form of misconduct may lead to penalties, suspension, or disqualification.",
  "Decisions taken by referees and the organizing committee shall be final and binding.",
  "Consumption of alcohol, tobacco, drugs, or any prohibited substances within the event premises is strictly prohibited.",
  "Violation of prohibited activities will result in immediate disqualification and possible further disciplinary action.",
  "Participants must respect the venue property and equipment. Any damage will be the responsibility of the concerned team or individual.",
  "Teams must report to the venue on time and maintain punctuality throughout the event.",
  "All participants are expected to cooperate with event volunteers and officials at all times.",
];

export default function CodeOfConduct() {
  return (
    <main className="conduct-page">
      <section className="conduct-hero">
        <div className="conduct-hero-content">
          <h1 className="conduct-page-title">Code of Conduct</h1>
          <p className="conduct-page-subtitle">
            Standards of behavior expected from all participants
          </p>
        </div>
      </section>

      <section className="conduct-content-section">
        <div className="conduct-page-container">
          <div className="conduct-intro">
            <p className="conduct-intro-text">
              To ensure a safe, respectful, and enjoyable environment for everyone, 
              all participants are required to adhere to the following code of conduct. 
              <strong> Failure to comply may result in penalties, suspension, or disqualification.</strong>
            </p>
          </div>

          <div className="conduct-card">
            <ul className="conduct-list">
              {codeOfConductRules.map((rule, idx) => (
                <li key={idx} className="conduct-item">
                  <span className="conduct-number">{idx + 1}.</span>
                  <span className="conduct-text">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="conduct-footer-note">
            <p className="note-text">
              By participating in this event, you acknowledge and agree to abide by this code of conduct. 
              The organizing committee reserves the right to take appropriate action against any violations.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
