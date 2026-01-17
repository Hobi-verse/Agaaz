import { useState } from "react";
import "./ScheduleSection.css";
import { schedulePage } from "../data/scheduleData";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ScheduleSection() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <section id="schedule" className="scheduleSection" aria-label="Schedule">
      <header className="scheduleHeader" aria-label="Schedule section header">
        <h2 className="scheduleTitle">{schedulePage.title}</h2>
        <p className="scheduleSubtitle">{schedulePage.subtitle}</p>
        <p className="scheduleEventDates">
          <FontAwesomeIcon icon={faCalendarAlt} />
          <span>{schedulePage.eventDates}</span>
        </p>
      </header>

      <div className="scheduleComingSoon">
        <Button className="scheduleViewBtn" onClick={() => setShowPopup(true)}>
          View Schedule
        </Button>
      </div>

      {showPopup && (
        <div
          className="schedulePopupOverlay"
          onClick={() => setShowPopup(false)}
        >
          <div className="schedulePopup" onClick={(e) => e.stopPropagation()}>
            <button
              className="schedulePopupClose"
              onClick={() => setShowPopup(false)}
              aria-label="Close popup"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="schedulePopupContent">
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="schedulePopupIcon"
              />
              <h3>Schedule Coming Soon!</h3>
              <p>The detailed schedule will be released soon. Stay tuned!</p>
              <p className="schedulePopupDates">
                Event Dates: {schedulePage.eventDates}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
