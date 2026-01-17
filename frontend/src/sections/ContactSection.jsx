import "./ContactSection.css";
import ProfileCard from "../components/profileCard";
import {
  contactCards,
  contactCards2,
  contactPage,
  contactPage2,
} from "../data/contactData";

export default function ContactSection() {
  return (
    <section id="contact" className="contactSection" aria-label="Contact">
      <div className="contactBlock">
        <div className="contactInner">
          <header className="contactHeader" aria-label="Contact section header">
            <h2 className="contactTitle">{contactPage.title}</h2>
            <p className="contactSubtitle">{contactPage.subtitle}</p>
          </header>
        </div>

        <section className="contactMarquee" aria-label="Contact cards">
          <div className="contactMarqueeMask" aria-hidden="true">
            <div className="contactMarqueeScroll">
              <div className="contactGrid contactMarqueeRow">
                {contactCards.map((c) => (
                  <ProfileCard
                    key={c.key}
                    name={c.name}
                    role={c.role}
                    imageSrc={c.imageSrc}
                    showSocials={false}
                  />
                ))}
                {/* Duplicate for seamless loop */}
                {contactCards.map((c) => (
                  <ProfileCard
                    key={`dup-${c.key}`}
                    name={c.name}
                    role={c.role}
                    imageSrc={c.imageSrc}
                    showSocials={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="contactBlock contactBlockSpacer">
        <div className="contactInner">
          <header className="contactHeader" aria-label="Contact section header">
            <h2 className="contactTitle">{contactPage2.title}</h2>
            <p className="contactSubtitle">{contactPage2.subtitle}</p>
          </header>
        </div>

        <section className="contactMarquee" aria-label="Contact cards">
          <div className="contactMarqueeMask" aria-hidden="true">
            <div className="contactMarqueeScroll">
              <div className="contactGrid contactMarqueeRow">
                {contactCards2.map((c) => (
                  <ProfileCard
                    key={c.key}
                    name={c.name}
                    role={c.role}
                    imageSrc={c.imageSrc}
                    showSocials={false}
                  />
                ))}
                {/* Duplicate for seamless loop */}
                {contactCards2.map((c) => (
                  <ProfileCard
                    key={`dup-${c.key}`}
                    name={c.name}
                    role={c.role}
                    imageSrc={c.imageSrc}
                    showSocials={false}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
