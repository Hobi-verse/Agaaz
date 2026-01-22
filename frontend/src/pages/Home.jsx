import "./Home.css";
import Button from "../components/Button";
import { homeHero, homeSponsors } from "../data/homeData";
import { useNavigate } from "react-router-dom";
import vcSir from "../assets/chief-guest/vc-image.jpeg";
import deanSir from "../assets/chief-guest/dean-sir.jpeg";
import financeOfficer from "../assets/chief-guest/financeOfficer.PNG";
import registrarMam from "../assets/chief-guest/registrar-mam.jpeg";
import { sportsManagers } from "../data/sportsManagerData.js";
import SportsManagerCard from "../components/SportsManagerCard.jsx";
import { useMemo } from "react";
import LazySection from "../components/LazySection";
import SportsLoader from "../components/SportsLoader";
import { sponsorsData } from "../data/sponsorsData";

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
  // {
  //   name: "Dr. Bhavna Mishra",
  //   designation: "Registrar",
  //   role: "University of Lucknow",
  //   image: registrarMam,
  // },
  {
    name: "Ms. Himani Chaudhary",
    designation: "Finance Officer",
    role: "University of Lucknow",
    image: financeOfficer,
  },
];

export default function Home() {
  const navigate = useNavigate();

  // Reduce animations on mobile for better performance
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const bubbleCount = isMobile ? 8 : 25;
  const emberCount = isMobile ? 5 : 15;

  const fireBubbles = useMemo(
    () => generateFireBubbles(bubbleCount),
    [bubbleCount],
  );
  const embers = useMemo(
    () =>
      Array.from({ length: emberCount }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: Math.random() * 4 + 6,
      })),
    [emberCount],
  );

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
        {embers.map((ember, i) => (
          <div
            key={i}
            className="ember"
            style={{
              left: `${ember.left}%`,
              animationDelay: `${ember.delay}s`,
              animationDuration: `${ember.duration}s`,
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
            <Button onClick={() => navigate("/register")}>
              {homeHero.ctaText}
            </Button>
            {/* <Button className="flickerButton">
              Registrations will <br /> start soon
            </Button> */}
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

      {/* <SportsManagerCard
        manager={sportsManagers.chess}
        sportName="Chess"
      /> */}
      {/* Live Scores Ticker */}
      <section className="sponsorsSection" aria-label="Sponsors">
        <h2 className="sponsorsTitle">Our Sponsors</h2>
        <div className="sponsorsGridWrapper">
          <div className="sponsorsGrid">
            {/* Set 1 */}
            <div className="sponsorsSet">
              {sponsorsData.map((sponsor) => (
                <div key={sponsor.id} className="sponsorCard">
                  <div className="sponsorImageWrapper">
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                      className="sponsorImage"
                      loading="lazy"
                    />
                  </div>
                  <div className="sponsorTextWrapper">
                    <span className="sponsorTag">{sponsor.tag}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Set 2 (Duplicate for mobile loop) */}
            <div className="sponsorsSet mobile-duplicate-set">
              {sponsorsData.map((sponsor) => (
                <div key={`${sponsor.id}-dup`} className="sponsorCard">
                  <div className="sponsorImageWrapper">
                    <img
                      src={sponsor.image}
                      alt={sponsor.name}
                      className="sponsorImage"
                      loading="lazy"
                    />
                  </div>
                  <div className="sponsorTextWrapper">
                    <span className="sponsorTag">{sponsor.tag}</span>
                    <p className="sponsorName">{sponsor.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
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
      <LazySection
        importer={() => import("../sections/ChiefGuest")}
        componentProps={{ members }}
        minHeight={280}
        rootMargin="600px 0px"
        fallback={<SportsLoader label="Warming up…" />}
      />

      <LazySection
        importer={() => import("../sections/AagaazThinking")}
        minHeight={220}
        rootMargin="700px 0px"
        fallback={<SportsLoader label="Setting the stage…" />}
      />

      <LazySection
        importer={() => import("../sections/SportsSection")}
        minHeight={320}
        rootMargin="700px 0px"
        fallback={<SportsLoader label="Loading sports…" />}
      />

      <LazySection
        importer={() => import("../sections/ScheduleSection")}
        minHeight={260}
        rootMargin="700px 0px"
        fallback={<SportsLoader label="Loading schedule…" />}
      />
      <LazySection
        importer={() => import("../sections/ContactSection")}
        minHeight={240}
        rootMargin="700px 0px"
        fallback={<SportsLoader label="Loading contact…" />}
      />
    </div>
  );
}
