import "./SportsSection.css";
import SportsCard from "../components/SportsCard";
import {
  sportsCards,
  SPORT_CARD_ROUTE_MAP,
  sportsPage,
} from "../data/sportsData";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function SportsSection() {
  const navigate = useNavigate();

  const handleSportClick = (sportKey) => {
    const sportId = SPORT_CARD_ROUTE_MAP[sportKey];
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

              <div className="sportsCardAction">
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
