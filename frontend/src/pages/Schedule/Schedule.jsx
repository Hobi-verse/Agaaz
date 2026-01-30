import React, { useState, useEffect } from "react";
import { getMatches } from "../../services/api";
import "./Schedule.css";

const Schedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ongoing");

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

  const ongoingMatches = matches.filter((match) => match.status === "ongoing");
  const upcomingMatches = matches.filter(
    (match) => match.status === "scheduled",
  );

  const renderMatchesTable = (matchList, title) => (
    <div className="scheduleTableWrap">
      <table className="scheduleTable">
        <thead>
          <tr>
            <th>Sport</th>
            <th>Participants</th>
            <th>Status</th>
            <th>Scheduled</th>
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
                      {match.sportName.charAt(0).toUpperCase()}
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
                        match.status === "ongoing" ? "#ff8e2f" : "#666",
                      color: "white",
                    }}
                  >
                    {match.status.toUpperCase()}
                  </span>
                </td>
                <td>
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
          <p className="scheduleSubtitle">View ongoing and upcoming matches</p>
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
        </div>

        {activeTab === "ongoing" &&
          renderMatchesTable(ongoingMatches, "Ongoing")}
        {activeTab === "upcoming" &&
          renderMatchesTable(upcomingMatches, "Upcoming")}
      </div>
    </div>
  );
};

export default Schedule;
