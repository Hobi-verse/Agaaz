import "./Home.css";
import Button from "../components/Button";
import { homeHero, homeSponsors } from "../data/homeData";
import SportsSection from "../sections/SportsSection";
import ScheduleSection from "../sections/ScheduleSection";
import ContactSection from "../sections/ContactSection";
import { useNavigate } from "react-router-dom";
import AagaazThinking from "../sections/AagaazThinking";
import ChiefGuest from "../sections/ChiefGuest";
import vcSir from "../assets/chief-guest/vc-image.jpeg";
import deanSir from "../assets/chief-guest/dean-sir.jpeg";
import financeOfficer from "../assets/chief-guest/financeOfficer.PNG";
import registrarMam from "../assets/chief-guest/registrar-mam.jpeg";
import { useMemo } from "react";

// Generate fire bubbles data
const generateFireBubbles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 20 + 8,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 4,
    hue: Math.random() * 40 + 10,
  }));
};

const members = [
  {
    name: "Prof. Jai Prakash Saini",
    designation: "Hon’ble Vice Chancellor",
    role: "University of Lucknow",
    image: vcSir,
  },
  {
    name: "Prof. S. P. Singh",
    designation: "Dean FoET",
    role: "University of Lucknow",
    image: deanSir,
  },
  {
    name: "Dr. Bhavna Mishra",
    designation: "Registrar",
    role: "University of Lucknow",
    image: registrarMam,
  },
  {
    name: "Ms. Himani Chaudhary",
    designation: "Finance Officer",
    role: "University of Lucknow",
    image: financeOfficer,
  },
];

export default function Home() {
  const navigate = useNavigate();
  const fireBubbles = useMemo(() => generateFireBubbles(25), []);

  const [heroTitlePrimary, heroTitleSecondary] = homeHero.title.split(/:\s*/);
  const [heroSubPrimary, heroSubSecondary] =
    homeHero.subtitle.split(/Fest\.\s*/);

  return (
    <div className="home">
      {/* Fire Bubbles Animation */}
      <div className="fireBubblesContainer" aria-hidden="true">
        {fireBubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="fireBubble"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.left}%`,
              animationDelay: `${bubble.delay}s`,
              animationDuration: `${bubble.duration}s`,
              background: `radial-gradient(circle at 30% 30%, 
                hsl(${bubble.hue + 20}, 100%, 70%) 0%, 
                hsl(${bubble.hue}, 100%, 50%) 50%, 
                hsl(${bubble.hue - 10}, 100%, 30%) 100%)`,
            }}
          />
        ))}
      </div>

      {/* Floating Embers */}
      <div className="embersContainer" aria-hidden="true">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 6}s`,
            }}
          />
        ))}
      </div>

      <section className="hero" aria-label="Home hero">
        <div className="heroInner">
          <div className="heroSponsors" aria-label="Sponsors">
            <div className="heroSponsorsLogos" aria-label="Sponsor logos">
              {homeSponsors.items.map((item) => (
                <div key={item.key} className="heroSponsorItem">
                  {item.src ? (
                    <img
                      className="heroSponsorLogo"
                      src={item.src}
                      alt={item.alt ?? item.label}
                      loading="lazy"
                    />
                  ) : (
                    item.label
                  )}
                </div>
              ))}
            </div>
          </div>
          <h1 className="heroTitle">
            <span className="heroTitleDesktop">{homeHero.title}</span>
            <span className="heroTitleMobile" aria-hidden="true">
              {heroTitlePrimary}:
              <br />
              {heroTitleSecondary}
            </span>
          </h1>

          <p className="heroSubtitle">
            <span className="heroSubtitleDesktop">{homeHero.subtitle}</span>
            <span className="heroSubtitleMobile" aria-hidden="true">
              {heroSubPrimary}Fest.
              <br />
              {heroSubSecondary}
            </span>
          </p>

          <p className="heroEventDates">
            <span>{homeHero.eventDates}</span>
          </p>

          <div className="heroCtaRow">
            {/* <Button onClick={() => navigate("/register")}>
              {homeHero.ctaText}
            </Button> */}
            <Button className="flickerButton">
              Registrations will <br /> start soon
            </Button>
            <Button onClick={() => navigate("/rules")}>
              Rules & Regulations
            </Button>
          </div>

          <p className="heroStatus">
            <span>{homeHero.statusPrefix}</span>
            <span className="heroLiveDot" aria-hidden="true" />
          </p>
        </div>
      </section>

      {/* Live Scores Ticker */}
      <section className="liveScoresTicker" aria-label="Live Scores">
        <div className="liveScoresHeader">
          <span className="liveScoresLiveDot" aria-hidden="true" />
          <span className="liveScoresTitle">Live Scores</span>
        </div>
        <div className="liveScoresTrack">
          <div className="liveScoresScroll">
            <span className="liveScoreItem">🏏 Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">⚽ Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">🏀 Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">🏐 Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">🏸 Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">🎾 Team 1 vs Team 2 - TBD</span>
            {/* Duplicate for seamless loop */}
            <span className="liveScoreItem">🏏 Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">⚽ Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">🏀 Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">🏐 Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">🏸 Team 1 vs Team 2 - TBD</span>
            <span className="liveScoreItem">🎾 Team 1 vs Team 2 - TBD</span>
          </div>
        </div>
        <p className="liveScoresNote">
          Live scores will be available when events are live
        </p>
      </section>

      <ChiefGuest members={members} />
      <AagaazThinking />

      <SportsSection />
      <ScheduleSection />
      <ContactSection />
    </div>
  );
}
