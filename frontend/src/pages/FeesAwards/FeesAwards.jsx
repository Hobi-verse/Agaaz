import "./FeesAwards.css";
import { sportsData } from "../../data/sportsData";

export default function FeesAwards() {
  const formatAmount = (amount) => {
    if (typeof amount === "string") return amount;
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  //data from sportsData (Data file)
  const feesAndAwards = [];
  sportsData.forEach((category) => {
    category.sports.forEach((sport) => {
      if (sport.subTypes) {
        sport.subTypes.forEach((sub) => {
          feesAndAwards.push({
            sport: `${sport.name} (${sub.name})`,
            category: category.name,
            entryFee: sub.fee,
            winner: "Will be Announced Soon",
          });
        });
      } else {
        feesAndAwards.push({
          sport: sport.name,
          category: category.name,
          entryFee: sport.fee,
          winner: "Will be Announced Soon",
        });
      }
    });
  });

  // Group fees by category for better table display
  const groupedFees = feesAndAwards.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
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
                  <th>CATEGORY</th>
                  <th>SPORTS</th>
                  <th>ENTRY FEES</th>
                  <th>WINNER</th>
                </tr>
              </thead>
              
            </table>
          </div>

          <div className="fees-note">
            <span className="note-icon">ℹ️</span>
            <p>Prize money will be announced soon. Stay tuned!</p>
          </div>
        </div>
      </section>
    </main>
  );
}
