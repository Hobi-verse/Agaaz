import "./FeesAwards.css";
import { sportsData } from "../../data/sportsData";

function formatAmount(amount) {
  return typeof amount === "string" ? amount : `₹${amount.toLocaleString("en-IN")}`;
}

function buildFeesAndAwards() {
  return sportsData.flatMap((category) =>
    category.sports.flatMap((sport) => {
      if (sport.subTypes) {
        return sport.subTypes.map((subType) => ({
          key: `${sport.id}-${subType.id}`,
          sport: `${sport.name} (${subType.name})`,
          category: category.name,
          entryFee: formatAmount(subType.fee),
          winner: "Will be Announced Soon",
        }));
      }

      return [
        {
          key: sport.id,
          sport: sport.name,
          category: category.name,
          entryFee: formatAmount(sport.fee),
          winner: "Will be Announced Soon",
        },
      ];
    }),
  );
}

export default function FeesAwards() {
  const feesAndAwards = buildFeesAndAwards();

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
              <tbody>
                {feesAndAwards.map((item) => (
                  <tr key={item.key}>
                    <td>{item.category}</td>
                    <td>{item.sport}</td>
                    <td>{item.entryFee}</td>
                    <td>{item.winner}</td>
                  </tr>
                ))}
              </tbody>
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
