import { useState, useMemo } from "react";
import { sportsConfig, eventDates } from "./WinningData.js";
import "./Result.css";

const Result = () => {
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Get all matches from all team sports
  const allTeamMatches = useMemo(() => {
    const matches = [];
    sportsConfig
      .filter((sport) => sport.type === "team")
      .forEach((sport) => {
        sport.data.forEach((match) => {
          matches.push({
            ...match,
            sportId: sport.id,
            sportName: sport.name,
            sportIcon: sport.icon,
          });
        });
      });
    return matches;
  }, []);

  // Get all individual sport events
  const allIndividualEvents = useMemo(() => {
    const events = [];
    sportsConfig
      .filter((sport) => sport.type === "individual")
      .forEach((sport) => {
        sport.data.forEach((event) => {
          events.push({
            ...event,
            sportId: sport.id,
            sportName: sport.name,
            sportIcon: sport.icon,
          });
        });
      });
    return events;
  }, []);

  // Filter team matches
  const filteredTeamMatches = useMemo(() => {
    return allTeamMatches.filter((match) => {
      const sportMatch =
        selectedSport === "all" || match.sportId === selectedSport;
      const dateMatch = selectedDate === "all" || match.date === selectedDate;
      const statusMatch =
        selectedStatus === "all" || match.status === selectedStatus;
      return sportMatch && dateMatch && statusMatch;
    });
  }, [allTeamMatches, selectedSport, selectedDate, selectedStatus]);

  // Filter individual events
  const filteredIndividualEvents = useMemo(() => {
    return allIndividualEvents.filter((event) => {
      const sportMatch =
        selectedSport === "all" || event.sportId === selectedSport;
      const dateMatch = selectedDate === "all" || event.date === selectedDate;
      const statusMatch =
        selectedStatus === "all" || event.status === selectedStatus;
      return sportMatch && dateMatch && statusMatch;
    });
  }, [allIndividualEvents, selectedSport, selectedDate, selectedStatus]);

  // Check if selected sport is team or individual type
  const selectedSportType = useMemo(() => {
    if (selectedSport === "all") return "all";
    const sport = sportsConfig.find((s) => s.id === selectedSport);
    return sport ? sport.type : "all";
  }, [selectedSport]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedSport("all");
    setSelectedDate("all");
    setSelectedStatus("all");
  };

  // Calculate stats
  const stats = useMemo(() => {
    return {
      totalMatches: 40,
      completed: 6,
      upcoming: 34,
      totalSports: 10,
    };
  }, []);

  const hasActiveFilters =
    selectedSport !== "cricket" ||
    selectedDate !== "2026-01-30" ||
    selectedStatus !== "completed";
  const showTeamResults =
    selectedSportType === "all" || selectedSportType === "team";
  const showIndividualResults =
    selectedSportType === "all" || selectedSportType === "individual";

  return (
    <div className="resultSection">
      {/* Header */}
      <div className="resultHeader">
        <h1 className="resultTitle">🏆 Sports Results</h1>
        <p className="resultSubtitle">
          View all match results and upcoming fixtures across all sports
        </p>
      </div>

      {/* Stats Bar */}
      <div className="statsBar">
        <div className="statsItem">
          <div className="statsValue">{stats.totalMatches}</div>
          <div className="statsLabel">Total Events</div>
        </div>

        <div className="statsDivider" />

        <div className="statsItem">
          <div className="statsValue">{stats.completed}</div>
          <div className="statsLabel">Completed</div>
        </div>

        <div className="statsDivider" />

        <div className="statsItem">
          <div className="statsValue">{stats.upcoming}</div>
          <div className="statsLabel">Upcoming</div>
        </div>

        <div className="statsDivider" />

        <div className="statsItem">
          <div className="statsValue">{stats.totalSports}</div>
          <div className="statsLabel">Sports</div>
        </div>
      </div>

      {/* Sport Tabs */}
      <div className="sports-tabs-container">
        <div className="scroll-hint">
          <span className="scroll-text">Swipe or scroll for more sports →</span>
        </div>
        <div className="sportsBar">
          {sportsConfig.map((sport) => (
            <button
              key={sport.id}
              className={`sportsBarItem ${
                selectedSport === sport.id ? "sportsBarItemActive" : ""
              }`}
              onClick={() => setSelectedSport(sport.id)}
            >
              <span className="sportsBarIcon">{sport.icon}</span>
              <span className="sportsBarText">{sport.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="resultFilters">
        <div className="filterGroup">
          <label className="filterLabel">Filter by Date</label>
          <select
            className="filterSelect"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="all">All Dates</option>
            {eventDates.map((d) => (
              <option key={d.date} value={d.date}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filterGroup">
          <label className="filterLabel">Filter by Status</label>
          <select
            className="filterSelect"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button className="resetFilterBtn" onClick={resetFilters}>
            Reset Filters
          </button>
        )}
      </div>

      {/* Team Sports Results Table */}
      {showTeamResults && filteredTeamMatches.length > 0 && (
        <div className="resultTableWrap">
          <div className="resultTableContainer">
            <table className="resultTable">
              <thead>
                <tr>
                  <th>Sport</th>
                  <th>Date</th>
                  <th>Team 1</th>
                  <th></th>
                  <th>Team 2</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeamMatches.map((match, index) => (
                  <tr
                    key={`${match.sportId}-${match.matchId}`}
                    className={match.status === "upcoming" ? "upcomingRow" : ""}
                  >
                    <td>
                      <span className="sportBadge">
                        <span className="sportBadgeIcon">
                          {match.sportIcon}
                        </span>
                        {match.sportName}
                      </span>
                    </td>
                    <td>{formatDate(match.date)}</td>
                    <td>
                      <div className="teamNameWrapper">
                        <span
                          className={`teamName ${match.winner === match.team1.name ? "winnerTeam" : ""}`}
                        >
                          {match.team1.name}
                        </span>
                        {match.team1.captain !== "TBD" && (
                          <div className="captainTooltip">
                            <span className="captainLabel">Captain</span>
                            <span className="captainName">
                              {match.team1.captain}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>VS</td>
                    <td>
                      <div className="teamNameWrapper">
                        <span
                          className={`teamName ${match.winner === match.team2.name ? "winnerTeam" : ""}`}
                        >
                          {match.team2.name}
                        </span>
                        {match.team2.captain !== "TBD" && (
                          <div className="captainTooltip">
                            <span className="captainLabel">Captain</span>
                            <span className="captainName">
                              {match.team2.captain}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {match.status === "completed" && match.winner ? (
                        <span className="winnerBadge">🏆 {match.winner}</span>
                      ) : (
                        <span className="toBePlayedBadge">⏳ To Be Played</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Individual Sports Results */}
      {showIndividualResults && filteredIndividualEvents.length > 0 && (
        <div
          style={{
            marginTop:
              showTeamResults && filteredTeamMatches.length > 0 ? "32px" : "0",
          }}
        >
          {filteredIndividualEvents.map((event) => (
            <div
              key={`${event.sportId}-${event.eventId}`}
              className="individualResultCard"
            >
              <div className="individualResultHeader">
                <div className="individualEventName">
                  <span>{event.sportIcon}</span>
                  {event.sportName} - {event.event}
                </div>
                <div className="individualEventDate">
                  📅 {formatDate(event.date)}
                </div>
                <span
                  className={`individualResultStatus ${event.status === "completed" ? "statusCompleted" : "statusUpcoming"}`}
                >
                  {event.status === "completed"
                    ? "✅ Completed"
                    : "⏳ Upcoming"}
                </span>
              </div>
              {event.status === "upcoming" && (
                <div className="noResults" style={{ padding: "30px 20px" }}>
                  <div className="noResultsIcon">🎯</div>
                  <p className="noResultsText">
                    Results will be updated after the event
                  </p>
                </div>
              )}
              {event.status === "completed" &&
                event.results &&
                event.results.length > 0 && (
                  <div className="resultTableContainer">
                    <table className="resultTable">
                      <thead>
                        <tr>
                          <th>Position</th>
                          <th>Name</th>
                          <th>College/Team</th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.results.map((result, idx) => (
                          <tr key={idx}>
                            <td>{result.position}</td>
                            <td>{result.name}</td>
                            <td>{result.college}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {filteredTeamMatches.length === 0 &&
        filteredIndividualEvents.length === 0 && (
          <div className="resultTableWrap">
            <div className="noResults">
              <div className="noResultsIcon">🔍</div>
              <p className="noResultsText">No results found</p>
              <p className="noResultsSubtext">
                Try adjusting your filters to see more results
              </p>
            </div>
          </div>
        )}
    </div>
  );
};

export default Result;
