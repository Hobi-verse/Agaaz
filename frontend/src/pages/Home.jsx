import "./Home.css";
import Button from "../components/Button";
import { homeHero, homeSponsors } from "../data/homeData";
import { useNavigate } from "react-router-dom";
import vcSir from "../assets/chief-guest/vc-image.jpeg";
import deanSir from "../assets/chief-guest/dean-sir.jpeg";
import financeOfficer from "../assets/chief-guest/financeOfficer.PNG";
import LazySection from "../components/LazySection";
import SportsLoader from "../components/SportsLoader";
import { sponsorsData } from "../data/sponsorsData";
import NewsAnnouncements from "../sections/NewsAnnouncements";
import FireBackground from "../components/FireBackground";

// Static members data (keep outside component)
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
    name: "Ms. Himani Chaudhary",
    designation: "Finance Officer",
    role: "University of Lucknow",
    image: financeOfficer,
  },
];

export default function Home() {
  const navigate = useNavigate();

  const [heroTitlePrimary, heroTitleSecondary] = homeHero.title.split(/:\s*/);

  const [heroSubPrimary, heroSubSecondary] =
    homeHero.subtitle.split(/Fest\.\s*/);

  return (
    <div className="home">
      <FireBackground />
      {/* HERO SECTION */}
      <section className="hero" aria-label="Home hero">
        <div className="heroInner">
          {/* Sponsors */}
          <div className="heroSponsors">
            <div className="heroSponsorsLogos">
              {homeSponsors.items.map((item) => (
                <div key={item.key} className="heroSponsorItem">
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={item.alt ?? item.label}
                      className="heroSponsorLogo"
                      loading="lazy"
                    />
                  ) : (
                    item.label
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <h1 className="heroTitle">
            <span className="heroTitleDesktop">{homeHero.title}</span>
            <span className="heroTitleMobile" aria-hidden="true">
              {heroTitlePrimary}:<br />
              {heroTitleSecondary}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="heroSubtitle">
            <span className="heroSubtitleDesktop">{homeHero.subtitle}</span>
            <span className="heroSubtitleMobile" aria-hidden="true">
              {heroSubPrimary}Fest.
              <br />
              {heroSubSecondary}
            </span>
          </p>

          {/* Event Dates */}
          <div className="heroEventDatesContainer">
            <p className="heroEventDates">
              <span>{homeHero.eventDates2}</span>
            </p>
            <p className="heroEventDates">
              <span>{homeHero.eventDates}</span>
            </p>
          </div>

          {/* CTA */}
          <div className="heroCtaRow">
            <Button onClick={() => navigate("/register")}>
              {homeHero.ctaText}
            </Button>
            <Button onClick={() => navigate("/rules")}>
              Rules & Regulations
            </Button>
          </div>

          {/* Status */}
          <p className="heroStatus">
            <span>{homeHero.statusPrefix}</span>
            <span className="heroLiveDot" aria-hidden="true" />
          </p>
        </div>
      </section>

      {/* NEWS & ANNOUNCEMENTS */}
      <NewsAnnouncements />

      {/* SPONSORS */}
      <section className="sponsorsSection" aria-label="Sponsors">
        <h2 className="sponsorsTitle">Our Sponsors</h2>
        <div className="sponsorsGridWrapper">
          <div className="sponsorsGrid">
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
                  <span className="sponsorTag">{sponsor.tag}</span>
                </div>
              ))}
            </div>

            {/* Duplicate set for mobile marquee */}
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
                  <span className="sponsorTag">{sponsor.tag}</span>
                  <p className="sponsorName">{sponsor.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LAZY SECTIONS */}
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
