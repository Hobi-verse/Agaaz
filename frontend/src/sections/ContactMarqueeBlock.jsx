import ProfileCard from "../components/ProfileCard";

export default function ContactMarqueeBlock({ cards, subtitle, title }) {
  return (
    <div className="contactBlock">
      <div className="contactInner">
        <header className="contactHeader" aria-label="Contact section header">
          <h2 className="contactTitle">{title}</h2>
          {subtitle ? <p className="contactSubtitle">{subtitle}</p> : null}
        </header>
      </div>

      <section className="contactMarquee" aria-label="Contact cards">
        <div className="contactMarqueeMask" aria-hidden="true">
          <div className="contactMarqueeScroll">
            <div className="contactGrid contactMarqueeRow">
              {cards.map((card) => (
                <ProfileCard
                  key={card.key}
                  name={card.name}
                  role={card.role}
                  imageSrc={card.imageSrc}
                  showSocials={false}
                />
              ))}
              {cards.map((card) => (
                <ProfileCard
                  key={`dup-${card.key}`}
                  name={card.name}
                  role={card.role}
                  imageSrc={card.imageSrc}
                  showSocials={false}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
