import "./ContactSection.css";
import ProfileCard from "../components/profileCard";
import { contactCards, contactPage } from "../data/contactData";

export default function ContactSection() {
  return (
    <section id="contact" className="contactSection" aria-label="Contact">
      <div className="contactInner">
        <header className="contactHeader" aria-label="Contact section header">
          <h2 className="contactTitle">{contactPage.title}</h2>
          <p className="contactSubtitle">{contactPage.subtitle}</p>
        </header>

        <div className="contactGrid" aria-label="Contact cards">
          {contactCards.map((c) => (
            <ProfileCard
              key={c.key}
              name={c.name}
              role={c.role}
              imageSrc={c.imageSrc}
              showSocials={false}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
