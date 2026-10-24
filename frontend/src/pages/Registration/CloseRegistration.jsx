import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarCheck,
  faCheck,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/Button";
import "./CloseRegistration.css";

const completedSports = [
  "Cricket",
  "Football",
  "Badminton",
  "Volleyball",
  "Kho-Kho",
  "Athletics",
  "Chess",
  "Carrom",
  "Table Tennis",
  "Tug of War",
];

const CloseRegistration = () => {
  const navigate = useNavigate();

  return (
    <main className="closeRegPage">
      <section className="closeRegCard" aria-labelledby="close-reg-title">
        <header className="closeRegHeader">
          <div className="closeRegStatus">
            <span className="closeRegStatusDot" aria-hidden="true" />
            Event completed
          </div>

          <div className="closeRegHero">
            <div className="closeRegIconWrap" aria-hidden="true">
              <FontAwesomeIcon icon={faTrophy} className="closeRegIcon" />
            </div>
            <div className="closeRegHeroCopy">
              <p className="closeRegEyebrow">Aagaaz Sports Fest</p>
              <h1 className="closeRegTitle" id="close-reg-title">
                That&apos;s a wrap!
              </h1>
              <p className="closeRegSubtitle">
                Thank you to every participant, volunteer, and supporter who
                made Aagaaz a success. The competition may be over, but the
                memories stay with us.
              </p>
            </div>
          </div>
        </header>

        <div className="closeRegGrid">
          <section className="closeRegSection closeRegCompleted" aria-labelledby="completed-title">
            <div className="closeRegSectionMeta">
              <span className="closeRegSectionEyebrow">Event recap</span>
              <span className="closeRegCount">
                {completedSports.length} sports &amp; events
              </span>
            </div>
            <h2 className="closeRegSectionTitle" id="completed-title">
              Registrations are closed
            </h2>
            <p className="closeRegSectionDesc">
              This year&apos;s events have been completed.
            </p>
            <ul className="sportsTagsWrap" aria-label="Completed sports and events">
              {completedSports.map((sport) => (
                <li key={sport} className="sportTag">
                  <FontAwesomeIcon icon={faCheck} className="sportTagIcon" aria-hidden="true" />
                  <span>{sport}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="closeRegSection closeRegThanks" aria-labelledby="thanks-title">
            <div className="closeRegThanksIcon" aria-hidden="true">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <p className="closeRegSectionEyebrow">Until next time</p>
            <h2 className="closeRegSectionTitle" id="thanks-title">
              See you next year!
            </h2>
            <p className="closeRegThanksCopy">
              We hope you had a brilliant time at Aagaaz. Stay tuned for the
              next edition of our sports fest.
            </p>
            <div className="closeRegThanksNote">
              <span className="closeRegThanksNoteMark" aria-hidden="true">✦</span>
              <span>Keep playing. Keep progressing.</span>
            </div>
          </section>
        </div>

        <footer className="closeRegFooter">
          <div className="closeRegFooterCopy">
            <span className="closeRegFooterLabel">Aagaaz event status</span>
            <span className="closeRegFooterStatus">
              <FontAwesomeIcon icon={faCheck} aria-hidden="true" />
              Successfully completed
            </span>
          </div>
          <Button className="closeRegBtnHome" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </footer>
      </section>
    </main>
  );
};

export default CloseRegistration;
