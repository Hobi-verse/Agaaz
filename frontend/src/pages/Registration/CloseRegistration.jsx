import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCalendarCheck,
  faFutbol,
  faHome,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import "./CloseRegistration.css";

const CloseRegistration = () => {
  const allSports = [
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

  return (
    <main className="closeRegPage">
      <section className="closeRegCard">
        {/* Header */}
        <div className="closeRegHeader">
          <div className="closeRegIconWrap">
            <FontAwesomeIcon
              icon={faTrophy}
              className="closeRegIcon"
              style={{ color: "#ffd700" }}
            />
          </div>
          <h1 className="closeRegTitle">Event Concluded! 🎉</h1>
          <p className="closeRegSubtitle">
            AAGAAZ has successfully concluded! Thank you to all participants,
            volunteers, and supporters for making this event a grand success.
          </p>
        </div>

        {/* Event Ended Section */}
        <div className="closeRegSection">
          <div className="closeRegSectionHeader">
            <FontAwesomeIcon icon={faCheckCircle} className="sectionIcon" style={{ color: "#10b981" }} />
            <h2 className="closeRegSectionTitle">
              All Registrations Permanently Closed
            </h2>
          </div>
          <p className="closeRegSectionDesc">
            The following sports events have been completed:
          </p>
          <div className="sportsTagsWrap">
            {allSports.map((sport) => (
              <span key={sport} className="sportTag sportTagOnline" style={{ opacity: 0.8 }}>
                <FontAwesomeIcon icon={faFutbol} className="sportTagIcon" />
                {sport}
              </span>
            ))}
          </div>
        </div>

        {/* Thank You Message */}
        <div className="closeRegSection closeRegSectionOffline">
          <div className="closeRegSectionHeader">
            <FontAwesomeIcon icon={faCalendarCheck} className="sectionIcon" />
            <h2 className="closeRegSectionTitle">Thank You for Participating!</h2>
          </div>
          <div className="venueCard">
            <div className="venueInfo">
              <h3 className="venueName">🏆 See You Next Year!</h3>
              <p className="venueDesc">
                We hope you had an amazing experience at Arambh. Stay tuned for
                the next edition of our sports fest!
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="closeRegActions">
          <Link to="/" className="closeRegBtn closeRegBtnHome">
            <FontAwesomeIcon icon={faHome} className="homeBtnIcon" />
            Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <div className="closeRegHelp">
          <div className="closeRegHelpTitle">Event Status</div>
          <div className="closeRegHelpRow">
            <span className="closeRegHelpName">✅ Event Successfully Completed</span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CloseRegistration;
