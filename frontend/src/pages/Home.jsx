import "./Home.css";
import Button from "../components/Button";
import { homeHero, homeSponsors } from "../data/homeData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import SportsSection from "../sections/SportsSection";
import ScheduleSection from "../sections/ScheduleSection";
import ContactSection from "../sections/ContactSection";
import CommitteeSection from "../sections/CommitteeSection";
import FeesSection from "../sections/FeesSection";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import AagaazThinking from "../sections/AagaazThinking";
import ChiefGuest from "../sections/ChiefGuest";
import vcSir from "../assets/chief-guest/vc-image.jpeg"
import deanSir from "../assets/chief-guest/dean-sir.jpeg"
import registrarMam from "../assets/chief-guest/registrar-mam.jpeg"

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
];

export default function Home() {
  const navigate = useNavigate();

  const [heroTitlePrimary, heroTitleSecondary] = homeHero.title.split(/:\s*/);
  const [heroSubPrimary, heroSubSecondary] =
    homeHero.subtitle.split(/Fest\.\s*/);

  return (
    <div className="home">
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

          <div className="heroCtaRow">
            <Button onClick={() => navigate("/register")}>
              {homeHero.ctaText}
            </Button>
          </div>

          <p className="heroEventDates">
            <FontAwesomeIcon icon={faCalendarAlt} />
            <span>{homeHero.eventDates}</span>
          </p>

          <p className="heroStatus">
            <span>{homeHero.statusPrefix}</span>
            <span className="heroLiveDot" aria-hidden="true" />
          </p>
        </div>
      </section>
      <ChiefGuest members={members}/>
      <AagaazThinking/>

      <SportsSection />
      <ScheduleSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
