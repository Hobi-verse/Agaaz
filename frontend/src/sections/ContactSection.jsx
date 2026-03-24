import "./ContactSection.css";
import ContactMarqueeBlock from "./ContactMarqueeBlock";
import { contactSections } from "../data/contactData";

export default function ContactSection() {
  return (
    <section id="contact" className="contactSection" aria-label="Contact">
      {contactSections.map((section, index) => (
        <div
          key={section.key}
          className={index > 0 ? "contactBlockSpacer" : undefined}
        >
          <ContactMarqueeBlock
            cards={section.cards}
            subtitle={section.subtitle}
            title={section.title}
          />
        </div>
      ))}
    </section>
  );
}
