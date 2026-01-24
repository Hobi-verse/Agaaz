import "./SportsSection.css";
import SportsCard from "../components/sportsCard";
import { sportsCards, sportsPage } from "../data/sportsData";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function SportsSection() {
  const navigate = useNavigate();

  // Map sport keys to sport IDs for navigation
  const sportKeyToId = {
    // basketball: "basketball",
    cricket: "cricket",
    football: "football",
    badminton: "badminton_singles",
    athletics: "athletics_100m",
    "athletics-5v5": "athletics_longjump",
  };

  const handleSportClick = (sportKey) => {
    const sportId = sportKeyToId[sportKey];
    if (sportId) {
      navigate(`/sport/${sportId}`);
    }
  };

  return (
    <section id="sports" className="sportsSection" aria-label="Sports">
      <header className="sportsHeader" aria-label="Sports section header">
        <h2 className="sportsTitle">{sportsPage.title}</h2>
        <p className="sportsSubtitle">{sportsPage.subtitle}</p>
      </header>
      <div className="sportsGridWrap">
        <div className="sportsGrid" aria-label="Sports list">
          {sportsCards.map((card) => (
            <SportsCard
              key={card.key}
              title={card.title}
              meta={card.meta}
              cta={card.cta}
              icon={card.icon}
              iconSrc={card.iconSrc}
              iconAlt={card.iconAlt}
              onCtaClick={() => handleSportClick(card.key)}
            />
          ))}

          <section
            className="sportsCard sportsMoreCard"
            aria-label="See more sports"
          >
            <div className="sportsCardInner">
              <h3 className="sportsTitle">SEE MORE SPORTS</h3>
              <p className="sportsMeta">Browse the full list of events</p>

              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  className="sportsCardCta"
                  onClick={() => navigate("/sports")}
                >
                  SEE MORE SPORTS
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
