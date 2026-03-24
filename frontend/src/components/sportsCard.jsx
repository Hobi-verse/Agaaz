import "./sportsCard.css";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./FormFields.css";

export default function SportsCard({
  title = "Cricket",
  meta = "Open Category",
  cta = "VIEW RULES & REGISTER",
  icon,
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

        <div className="sportsCardAction">
          <Button className="sportsCardCta" onClick={onCtaClick}>
            {cta}
          </Button>
        </div>
      </div>
    </section>
  );
}
