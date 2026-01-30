import React, { useState, useEffect } from "react";
import { getMatches } from "../../services/api";
import "./Schedule.css";

// Sport icons mapping
const SPORT_ICONS = {
  // Athletics
  athletics_100m: "🏃",
  athletics_200m: "🏃",
  athletics_400m: "🏃",
  athletics_4x100m_relay: "🏃",
  athletics_longjump: "🏃",
  cycling: "🚴",
  weightlifting: "🏋️",

  // Team Sports
  cricket: "🏏",
  tug_of_war: "🤼",
  kho_kho: "🏃",
  volleyball: "🏐",
  basketball: "🏀",
  football: "⚽",

  // Indoor Sports
  chess: "♟️",
  carrom: "🎯",
  carrom_singles: "🎯",

  // Badminton
  badminton_singles: "🏸",
  badminton_doubles: "🏸",
  badminton_mixed_doubles: "🏸",

  // Table Tennis
  table_tennis_singles: "🏓",
  table_tennis_doubles: "🏓",

  // Default
  default: "🏆",
};

const Schedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedSport, setSelectedSport] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showFilterDropdown &&
        !event.target.closest(".scheduleFilterDropdown")
      ) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterDropdown]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const result = await getMatches();
      if (result.success) {
        setMatches(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to fetch matches");
    } finally {
      setLoading(false);
    }
  };

  const ongoingMatches = matches.filter((match) => match.status === "ongoing");
  const upcomingMatches = matches.filter(
    (match) => match.status === "scheduled",
  );
  const completedMatches = matches.filter(
    (match) => match.status === "finished",
  );

  // Get unique sports from all matches
  const uniqueSports = Array.from(
    new Set(matches.map((match) => match.sportId)),
  )
    .map((sportId) => {
      const match = matches.find((m) => m.sportId === sportId);
      return {
        id: sportId,
        name: match.sportName,
        category: match.sportCategory,
        icon: SPORT_ICONS[sportId] || SPORT_ICONS.default,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter matches by selected sport
  const filterMatchesBySport = (matchList) => {
    if (selectedSport === "all") return matchList;
    return matchList.filter((match) => match.sportId === selectedSport);
  };

  const renderMatchesTable = (matchList, title) => (
    <div className="scheduleTableWrap">
      <table className="scheduleTable">
        <thead>
          <tr>
            <th>Sport</th>
            <th>Participants</th>
            <th>Status</th>
            <th>{title === "Completed" ? "Result" : "Scheduled"}</th>
          </tr>
        </thead>
        <tbody>
          {matchList.length === 0 ? (
            <tr>
              <td colSpan="4" className="scheduleEmptyState">
                No {title.toLowerCase()} matches
              </td>
            </tr>
          ) : (
            matchList.map((match) => (
              <tr key={match._id}>
                <td>
                  <div className="scheduleSport">
                    <div className="scheduleSportIcon">
                      {SPORT_ICONS[match.sportId] || SPORT_ICONS.default}
                    </div>
                    <div>
                      <div className="scheduleSportName">{match.sportName}</div>
                      {match.sportCategory && (
                        <div className="scheduleSportCategory">
                          {match.sportCategory}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className="scheduleParticipants">
                    {match.participants.map((participant, index) => (
                      <div key={index} className="scheduleParticipant">
                        <span>{participant.name}</span>
                        {participant.registrationId && (
                          <span className="scheduleParticipantId">
                            ({participant.registrationId})
                          </span>
                        )}
                        {match.status === "finished" &&
                          match.winnerName === participant.name && (
                            <span className="scheduleWinnerBadge">
                              🏆 Winner
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <span
                    className={`scheduleStatusBadge scheduleStatusBadge--${match.status}`}
                  >
                    {match.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {match.status === "finished" ? (
                    <div className="scheduleResult">
                      <div className="scheduleWinner">
                        🏆 {match.winnerName}
                      </div>
                      {(match.scoreA || match.scoreB) && (
                        <div className="scheduleScore">
                          Score: {match.scoreA || 0} - {match.scoreB || 0}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="scheduleDateTime">
                      <div className="scheduleDate">
                        {match.scheduledAt
                          ? new Date(match.scheduledAt).toLocaleDateString()
                          : new Date(match.createdAt).toLocaleDateString()}
                      </div>
                      <div className="scheduleTime">
                        {match.scheduledAt
                          ? new Date(match.scheduledAt).toLocaleTimeString()
                          : new Date(match.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  if (loading) {
    return (
      <div className="schedulePage">
        <div className="scheduleSection">
          <div className="scheduleLoading">Loading matches...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedulePage">
        <div className="scheduleSection">
          <div className="scheduleError">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="schedulePage">
      <div className="scheduleSection">
        <div className="scheduleHeader">
          <h1 className="scheduleTitle">Match Schedule</h1>
          <p className="scheduleSubtitle">
            View ongoing, upcoming, and completed matches with results
          </p>
        </div>

        <div className="scheduleTabs">
          <button
            className={`scheduleTab ${activeTab === "ongoing" ? "scheduleTabActive" : ""}`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing ({filterMatchesBySport(ongoingMatches).length})
          </button>
          <button
            className={`scheduleTab ${activeTab === "upcoming" ? "scheduleTabActive" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({filterMatchesBySport(upcomingMatches).length})
          </button>
          <button
            className={`scheduleTab ${activeTab === "completed" ? "scheduleTabActive" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({filterMatchesBySport(completedMatches).length})
          </button>
        </div>

        <div className="scheduleFilters">
          <div className="scheduleFilterDropdown">
            <button
              className="scheduleFilterButton"
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            >
              <span>
                Filter by Sport:{" "}
                {selectedSport === "all"
                  ? "All Sports"
                  : `${uniqueSports.find((s) => s.id === selectedSport)?.icon} ${uniqueSports.find((s) => s.id === selectedSport)?.name}`}
              </span>
              <span className="scheduleFilterArrow">
                {showFilterDropdown ? "▲" : "▼"}
              </span>
            </button>
            {showFilterDropdown && (
              <div className="scheduleFilterOptions">
                <button
                  className={`scheduleFilterOption ${selectedSport === "all" ? "scheduleFilterOptionActive" : ""}`}
                  onClick={() => {
                    setSelectedSport("all");
                    setShowFilterDropdown(false);
                  }}
                >
                  All Sports
                </button>
                {uniqueSports.map((sport) => (
                  <button
                    key={sport.id}
                    className={`scheduleFilterOption ${selectedSport === sport.id ? "scheduleFilterOptionActive" : ""}`}
                    onClick={() => {
                      setSelectedSport(sport.id);
                      setShowFilterDropdown(false);
                    }}
                  >
                    <span className="scheduleFilterIcon">{sport.icon}</span>
                    {sport.name}
                    {sport.category && (
                      <span className="scheduleFilterCategory">
                        ({sport.category})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {activeTab === "ongoing" &&
          renderMatchesTable(filterMatchesBySport(ongoingMatches), "Ongoing")}
        {activeTab === "upcoming" &&
          renderMatchesTable(filterMatchesBySport(upcomingMatches), "Upcoming")}
        {activeTab === "completed" &&
          renderMatchesTable(
            filterMatchesBySport(completedMatches),
            "Completed",
          )}
      </div>
    </div>
  );
};

export default Schedule;
