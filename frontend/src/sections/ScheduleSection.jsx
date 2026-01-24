import { useState} from "react";
import "./ScheduleSection.css";
import { schedulePage } from "../data/scheduleData";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faTimes, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { schedule } from "../data/eventSchedule.js";

export default function ScheduleSection() {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSport, setSelectedSport] = useState("All");
  const [selectedDay, setSelectedDay] = useState("All Days");
  const hasSchedule = schedule && schedule.length > 0;

  // Extract unique sports from schedule
  const getSportName = (game) => {
    if (game.includes("Cricket")) return "Cricket";
    if (game.includes("Football")) return "Football";
    if (game.includes("Volleyball")) return "Volleyball";
    if (game.includes("Badminton")) return "Badminton";
    if (game.includes("Chess") || game.includes("Carrom") || game.includes("E-Sports")) return "Indoor Games";
    if (game.includes("Buffer")) return "Buffer";
    if (game.includes("Closing Ceremony")) return "Closing Ceremony";
    return game;
  };

  const sports =['All', ...new Set(schedule.map(item => getSportName(item.game)).filter(sport => sport !== "Buffer"))];
  const days = ["All Days", "31st Jan", "1st Feb", "2nd Feb"];
  
  // Filter schedule by selected day and sport
  let filteredSchedule = schedule;
  
  // Apply day filter
  if (selectedDay !== "All Days") {
    filteredSchedule = filteredSchedule.filter(item => item.day === selectedDay);
  }
  
  // Apply sport filter (exclude buffer times from individual sports)
  if (selectedSport !== "All") {
    filteredSchedule = filteredSchedule.filter(item => getSportName(item.game) === selectedSport);
  }

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
              {hasSchedule ? (
                <>
                  <h3 className="schedulePopupTitle">Event Schedule</h3>
                  <p className="schedulePopupDates">
                    {schedulePage.eventDates}
                  </p>

                  {/* Sports Filter Tabs with Day Dropdown */}
                  <div className="scheduleSportsTabs">
                    {/* Day Dropdown integrated in tabs */}
                    <div className="scheduleDropdownWrapper">
                      <select 
                        value={selectedDay} 
                        onChange={(e) => setSelectedDay(e.target.value)}
                        className="scheduleSportsTab scheduleDayDropdown"
                      >
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                      <FontAwesomeIcon icon={faChevronDown} className="scheduleDropdownIcon" />
                    </div>

                    {sports.map(sport => (
                      <button
                        key={sport}
                        className={`scheduleSportsTab ${selectedSport === sport ? 'scheduleSportsTabActive' : ''}`}
                        onClick={() => setSelectedSport(sport)}
                      >
                        {sport}
                      </button>
                    ))}
                  </div>

                  {/* Important Notes */}
                  <div className="scheduleNotes">
                    <p>
                      <strong>Note:</strong> Reporting time is one hour before game start. 
                      Detailed fixture will be provided soon.
                    </p>
                  </div>

                  <div className="scheduleTableContainer">
                    <table className="scheduleTable">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Event</th>
                          <th>Venue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSchedule.map((item, index) => (
                          <tr key={index} className={item.game === "Buffer Time" ? "bufferRow" : ""}>
                            <td>{item.time}</td>
                            <td>{item.game}</td>
                            <td>{item.venue}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="schedulePopupIcon"
                  />
                  <h3>Schedule Coming Soon!</h3>
                  <p>The detailed schedule will be released soon. Stay tuned!</p>
                  <p className="schedulePopupDates">
                    Event Dates: {schedulePage.eventDates}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
