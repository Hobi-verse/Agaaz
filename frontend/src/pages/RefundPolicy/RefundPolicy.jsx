import "./RefundPolicy.css";

const refundPolicyRules = [
  {
    title: "Non-Refundable Fees",
    description:
      "Registration fees are strictly non-refundable under any circumstances.",
  },
  {
    title: "Disqualification",
    description:
      "No refund will be provided in case of disqualification, including but not limited to: failure to produce a valid college ID, violation of rules and regulations, misconduct or disciplinary issues, late reporting or walkover.",
  },
  {
    title: "Voluntary Withdrawal",
    description:
      "No refund will be issued if a team withdraws voluntarily after registration.",
  },
  {
    title: "Inability to Participate",
    description:
      "In case a team is unable to participate due to personal reasons, scheduling conflicts, or absence on the match day, no refund shall be entertained.",
  },
  {
    title: "Event Cancellation",
    description:
      "Refunds will be considered only if the event is canceled by the organizing committee, and the decision regarding refunds will rest solely with the organizers.",
  },
  {
    title: "Final Authority",
    description:
      "The committee's decisions regarding refunds will be final and non-negotiable. Any situation not covered under these rules will be resolved by the organizing committee.",
  },
];

export default function RefundPolicy() {
  return (
    <main className="refund-page">
      <section className="refund-hero">
        <div className="refund-hero-content">
          <h1 className="refund-page-title">Refund Policy</h1>
          <p className="refund-page-subtitle">
            Registration fee and refund guidelines
          </p>
        </div>
      </section>

      <section className="refund-content-section">
        <div className="refund-page-container">
          <div className="refund-intro">
            <p className="refund-intro-text">
              Please read our refund policy carefully before registering for the
              event.
              <strong>
                {" "}
                By completing your registration, you agree to the terms outlined
                below.
              </strong>
            </p>
          </div>

          <div className="refund-card refund-rules-card">
            <h2 className="refund-rules-heading">Refund Rules</h2>
            <ol className="refund-rules-list">
              {refundPolicyRules.map((item, idx) => (
                <li key={item.title} className="refund-rules-item">
                  <span className="refund-rules-index">{idx + 1}.</span>
                  <div className="refund-rules-text">
                    <span className="refund-rules-item-title">
                      {item.title}:
                    </span>{" "}
                    <span className="refund-rules-item-description">
                      {item.description}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="refund-footer-note">
            <p className="note-text">
              For any queries regarding refunds, please contact the organizing
              committee. All decisions made by the committee are final and
              binding.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
