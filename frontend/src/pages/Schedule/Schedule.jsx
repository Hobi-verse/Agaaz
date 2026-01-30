import React, { useState, useEffect } from "react";
import { getMatches } from "../../services/api";
import "./Schedule.css";

// Sport icon mapping
const getSportIcon = (sportName) => {
  const iconMap = {
    // Cricket
    Cricket: "🏏",
    // Football/Soccer
    Football: "⚽",
    // Badminton
    Badminton: "🏸",
    "Badminton Singles": "🏸",
    "Badminton Doubles": "🏸",
    "Badminton Mixed Doubles": "🏸",
    // Table Tennis
    "Table Tennis": "🏓",
    "Table Tennis Singles": "🏓",
    "Table Tennis Doubles": "🏓",
    "Table Tennis Mixed Doubles": "🏓",
    // Athletics
    "100 Meter Race": "🏃",
    "200 Meter Race": "🏃",
    "400 Meter Race": "🏃",
    "4x100 Meter Relay": "🏃",
    "Long Jump": "🏃",
    Cycling: "🚴",
    Weightlifting: "🏋️",
    // Team Sports
    "Tug of War": "🤼",
    "Kho-Kho": "🤼",
    Volleyball: "🏐",
    Basketball: "🏀",
    // Indoor Sports
    Chess: "♟️",
    Carrom: "🎯",
    // Esports
    BGMI: "🎮",
    "Free Fire": "🎮",
    "Clash Royale": "🎮",
  };

  return iconMap[sportName] || "🏆"; // Default trophy icon
};

const Schedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedSport, setSelectedSport] = useState("all");

  useEffect(() => {
    fetchMatches();
  }, []);

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

  const handleSportFilter = (sportId) => {
    setSelectedSport(sportId);
  };

  // Get unique sports from matches
  const availableSports = Array.from(
    new Set(matches.map((match) => match.sportId)),
  ).map((sportId) => {
    const match = matches.find((m) => m.sportId === sportId);
    return {
      id: sportId,
      name: match.sportName,
      icon: getSportIcon(match.sportName),
    };
  });

  // Filter matches by selected sport
  const filterMatchesBySport = (matchList) => {
    if (selectedSport === "all") return matchList;
    return matchList.filter((match) => match.sportId === selectedSport);
  };

  const ongoingMatches = filterMatchesBySport(
    matches.filter((match) => match.status === "ongoing"),
  );
  const upcomingMatches = filterMatchesBySport(
    matches.filter((match) => match.status === "scheduled"),
  );
  const completedMatches = filterMatchesBySport(
    matches.filter((match) => match.status === "finished"),
  );

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
              <td
                colSpan="4"
                style={{ textAlign: "center", color: "rgba(255,255,255,0.5)" }}
              >
                No {title.toLowerCase()} matches
              </td>
            </tr>
          ) : (
            matchList.map((match) => (
              <tr key={match._id}>
                <td>
                  <div className="scheduleSport">
                    <div className="scheduleSportIcon">
                      {getSportIcon(match.sportName)}
                    </div>
                    <div>
                      <div style={{ fontWeight: "600" }}>{match.sportName}</div>
                      {match.sportCategory && (
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "rgba(255,255,255,0.6)",
                          }}
                        >
                          {match.sportCategory}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25rem",
                    }}
                  >
                    {match.participants.map((participant, index) => (
                      <div key={index} style={{ fontSize: "0.9rem" }}>
                        {participant.name}
                        {participant.registrationId && (
                          <span
                            style={{
                              color: "rgba(255,255,255,0.6)",
                              marginLeft: "0.5rem",
                            }}
                          >
                            ({participant.registrationId})
                          </span>
                        )}
                        {match.status === "finished" &&
                          match.winnerName === participant.name && (
                            <span
                              style={{
                                color: "#ffb24a",
                                fontWeight: "bold",
                                marginLeft: "0.5rem",
                              }}
                            >
                              🏆 Winner
                            </span>
                          )}
                      </div>
                    ))}
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      padding: "0.25rem 0.5rem",
                      borderRadius: "4px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      backgroundColor:
                        match.status === "ongoing"
                          ? "#ff8e2f"
                          : match.status === "finished"
                            ? "#4CAF50"
                            : "#666",
                      color: "white",
                    }}
                  >
                    {match.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {match.status === "finished" ? (
                    <div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          color: "#ffb24a",
                        }}
                      >
                        Winner: {match.winnerName}
                      </div>
                      {(match.scoreA || match.scoreB) && (
                        <div
                          style={{
                            fontSize: "0.8rem",
                            color: "rgba(255,255,255,0.7)",
                          }}
                        >
                          Score: {match.scoreA || 0} - {match.scoreB || 0}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div
                        style={{
                          fontSize: "0.85rem",
                          color: "rgba(255,255,255,0.7)",
                        }}
                      >
                        {match.scheduledAt
                          ? new Date(match.scheduledAt).toLocaleDateString()
                          : new Date(match.createdAt).toLocaleDateString()}
                      </div>
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "rgba(255,255,255,0.5)",
                        }}
                      >
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
          <div style={{ textAlign: "center", color: "white", padding: "2rem" }}>
            Loading matches...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="schedulePage">
        <div className="scheduleSection">
          <div
            style={{ textAlign: "center", color: "#ff6b6b", padding: "2rem" }}
          >
            Error: {error}
          </div>
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

        {/* Sport Filter */}
        <div className="scheduleFilter">
          <label
            htmlFor="sportFilter"
            style={{
              color: "rgba(255,255,255,0.8)",
              marginRight: "0.5rem",
              fontSize: "0.9rem",
            }}
          >
            Filter by Sport:
          </label>
          <select
            id="sportFilter"
            value={selectedSport}
            onChange={(e) => handleSportFilter(e.target.value)}
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              fontSize: "0.9rem",
              cursor: "pointer",
              minWidth: "200px",
            }}
          >
            <option
              value="all"
              style={{ background: "#24243e", color: "white" }}
            >
              All Sports
            </option>
            {availableSports.map((sport) => (
              <option
                key={sport.id}
                value={sport.id}
                style={{ background: "#24243e", color: "white" }}
              >
                {sport.icon} {sport.name}
              </option>
            ))}
          </select>
        </div>

        <div className="scheduleTabs">
          <button
            className={`scheduleTab ${activeTab === "ongoing" ? "scheduleTabActive" : ""}`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing ({ongoingMatches.length})
          </button>
          <button
            className={`scheduleTab ${activeTab === "upcoming" ? "scheduleTabActive" : ""}`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming ({upcomingMatches.length})
          </button>
          <button
            className={`scheduleTab ${activeTab === "completed" ? "scheduleTabActive" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({completedMatches.length})
          </button>
        </div>

        {activeTab === "ongoing" &&
          renderMatchesTable(ongoingMatches, "Ongoing")}
        {activeTab === "upcoming" &&
          renderMatchesTable(upcomingMatches, "Upcoming")}
        {activeTab === "completed" &&
          renderMatchesTable(completedMatches, "Completed")}
      </div>
    </div>
  );
};

export default Schedule;
