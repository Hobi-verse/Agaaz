import "./FeesAwards.css";
import { feesAndAwards } from "../../data/feesData";
import Footer from "../../components/Footer";

export default function FeesAwards() {
  const formatAmount = (amount) => {
    if (typeof amount === "string") return amount;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Group fees by sport for better table display (like the image)
  const groupedFees = feesAndAwards.reduce((acc, item) => {
    if (!acc[item.sport]) {
      acc[item.sport] = [];
    }
    acc[item.sport].push(item);
    return acc;
  }, {});

  return (
    <main className="fees-page">
      <section className="fees-hero">
        <div className="fees-hero-content">
          <h1 className="fees-page-title">Fees & Awards</h1>
          <p className="fees-page-subtitle">
            Entry fees and prize money for all sports categories
          </p>
        </div>
      </section>

      <section className="fees-table-section">
        <div className="fees-page-container">
          <div className="fees-table-wrapper">
            <table className="fees-table">
              <thead>
                <tr>
                  <th>SPORTS</th>
                  <th>CATEGORY</th>
                  <th>ENTRY FEES</th>
                  <th>WINNER</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupedFees).map(([sport, categories]) =>
                  categories.map((item, idx) => (
                    <tr key={`${sport}-${item.category}-${idx}`}>
                      {idx === 0 ? (
                        <td 
                          className="sport-name" 
                          rowSpan={categories.length}
                        >
                          {sport.toUpperCase()}
                        </td>
                      ) : null}
                      <td className="category-name">{item.category.toUpperCase()}</td>
                      <td className="entry-fee">{formatAmount(item.entryFee)}</td>
                      <td className="winner-prize">{formatAmount(item.winner)}</td>
                    </tr>
                  ))
                )}
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

      <Footer />
    </main>
  );
}
