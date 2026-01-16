import "./FeesSection.css";
import { feesAndAwards } from "../data/feesData";

export default function FeesSection() {
  const formatAmount = (amount) => {
    if (typeof amount === "string") return amount;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  return (
    <section className="fees-section" id="fees" aria-label="Fees and Awards">
      <div className="fees-container">
        <div className="fees-header">
          <h2 className="fees-title">Fees & Awards</h2>
          <p className="fees-subtitle">
            Entry fees and prize money for all sports categories
          </p>
        </div>

        <div className="fees-table-wrapper">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Sports</th>
                <th>Category</th>
                <th>Entry Fees</th>
                <th>Winner</th>
              </tr>
            </thead>
            <tbody>
              {feesAndAwards.map((item, index) => (
                <tr key={`${item.sport}-${item.category}-${index}`}>
                  <td className="sport-name">{item.sport}</td>
                  <td className="category-name">{item.category}</td>
                  <td className="entry-fee">{formatAmount(item.entryFee)}</td>
                  <td className="winner-prize">{formatAmount(item.winner)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="fees-note">
          <span className="note-icon">ℹ️</span>
          <p>
            Prize money will be announced soon. Stay tuned!
          </p>
        </div>
      </div>
    </section>
  );
}
