import "./sportsCard.css";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBasketball } from "@fortawesome/free-solid-svg-icons";

export default function SportsCard({
  title = "Cricket",
  meta = "Open Category",
  cta = "VIEW RULES & REGISTER",
  icon, // = faBasketball,
  iconSrc,
  iconAlt,
  onCtaClick,
}) {
  return (
    <section className="sportsCard" aria-label={title}>
      <div className="sportsCardInner">
        {iconSrc ? (
          <img
            className="sportsPngIcon"
            src={iconSrc}
            alt={iconAlt ?? ""}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <FontAwesomeIcon className="sportsFaIcon" icon={icon} />
        )}

        <h3 className="sportsTitle">{title}</h3>
        <p className="sportsMeta">{meta}</p>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button className="sportsCardCta" onClick={onCtaClick}>
            {cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
