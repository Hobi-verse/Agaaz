import { useEffect, useMemo, useState } from "react";

import {
  formatMatchDateTime,
  SCHEDULE_SPORT_ICONS,
  supportsLiveScore,
} from "../../features/matches/utils";
import { getMatches } from "../../services/api";
import "./Schedule.css";

const Schedule = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedSport, setSelectedSport] = useState("all");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchMatches(showLoader = false) {
      try {
        if (showLoader) setLoading(true);
        const result = await getMatches();
        if (!result.success) {
          throw new Error(result.error || "Failed to fetch matches");
        }

        if (!cancelled) {
          setMatches(result.data || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to fetch matches");
        }
      } finally {
        if (!cancelled && showLoader) {
          setLoading(false);
        }
      }
    }

    fetchMatches(true);
    const intervalId = window.setInterval(() => fetchMatches(false), 15000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

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

  const liveScoreMatches = useMemo(
    () => matches.filter((match) => supportsLiveScore(match.sportId)),
    [matches],
  );

  const ongoingMatches = liveScoreMatches.filter(
    (match) => match.status === "ongoing",
  );
  const upcomingMatches = liveScoreMatches.filter(
    (match) => match.status === "scheduled",
  );
  const completedMatches = liveScoreMatches.filter(
    (match) => match.status === "finished",
  );

  const uniqueSports = Array.from(
    new Set(liveScoreMatches.map((match) => match.sportId)),
  )
    .map((sportId) => {
      const match = liveScoreMatches.find((m) => m.sportId === sportId);
      return {
        id: sportId,
        name: match?.sportName || sportId,
        category: match?.sportCategory || "",
        icon: SCHEDULE_SPORT_ICONS[sportId] || SCHEDULE_SPORT_ICONS.default,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const filterMatchesBySport = (matchList) => {
    if (selectedSport === "all") return matchList;
    return matchList.filter((match) => match.sportId === selectedSport);
  };

  const activeMatches =
    activeTab === "ongoing"
      ? filterMatchesBySport(ongoingMatches)
      : activeTab === "upcoming"
        ? filterMatchesBySport(upcomingMatches)
        : filterMatchesBySport(completedMatches);

  const renderScoreboard = (match) => {
    const a = match.participants?.[0];
    const b = match.participants?.[1];
    const updatedInfo = formatMatchDateTime(match.liveScoreUpdatedAt);
    const scheduleInfo = formatMatchDateTime(
      match.scheduledAt || match.createdAt,
    );

    if (match.status === "scheduled") {
      return (
        <div className="scheduleDateTime">
          <div className="scheduleDate">{scheduleInfo.date}</div>
          <div className="scheduleTime">{scheduleInfo.time}</div>
        </div>
      );
    }

    return (
      <div className="scheduleResult scheduleResult--live">
        <div className="scheduleLiveScore">
          <div className="scheduleLiveTeam">
            <span className="scheduleLiveTeamName">{a?.name || "TBD"}</span>
            <span className="scheduleLiveTeamValue">{match.scoreA || 0}</span>
          </div>
          <div className="scheduleLiveSeparator">:</div>
          <div className="scheduleLiveTeam">
            <span className="scheduleLiveTeamName">{b?.name || "TBD"}</span>
            <span className="scheduleLiveTeamValue">{match.scoreB || 0}</span>
          </div>
        </div>

        {match.status === "ongoing" ? (
          <div className="scheduleLiveMeta">
            <span className="scheduleLiveIndicator">LIVE</span>
            <span>
              {match.liveScoreUpdatedAt
                ? `Updated ${updatedInfo.time}`
                : "Waiting for first score update"}
            </span>
          </div>
        ) : (
          <div className="scheduleLiveMeta">
            <span className="scheduleWinner">🏆 {match.winnerName || "-"}</span>
            <span>
              Finalized{" "}
              {match.liveScoreUpdatedAt
                ? updatedInfo.time
                : formatMatchDateTime(match.updatedAt).time}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="schedulePage">
        <div className="scheduleSection">
          <div className="scheduleLoading">Loading live match scores...</div>
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
          <h1 className="scheduleTitle">Live Match Score</h1>
          <p className="scheduleSubtitle">
            Track live scores for point-based sports. Result-only events such as
            races are excluded from this page.
          </p>
          <p className="scheduleHeaderNote">
            Auto-refreshes every 15 seconds while the page is open.
          </p>
        </div>

        <div className="scheduleTabs">
          <button
            className={`scheduleTab ${activeTab === "ongoing" ? "scheduleTabActive" : ""}`}
            onClick={() => setActiveTab("ongoing")}
          >
            Live Now ({filterMatchesBySport(ongoingMatches).length})
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
                Sport:{" "}
                {selectedSport === "all"
                  ? "All score-based sports"
                  : `${uniqueSports.find((s) => s.id === selectedSport)?.icon} ${uniqueSports.find((s) => s.id === selectedSport)?.name}`}
              </span>
              <span className="scheduleFilterArrow">
                {showFilterDropdown ? "▲" : "▼"}
              </span>
            </button>
            {showFilterDropdown ? (
              <div className="scheduleFilterOptions">
                <button
                  className={`scheduleFilterOption ${selectedSport === "all" ? "scheduleFilterOptionActive" : ""}`}
                  onClick={() => {
                    setSelectedSport("all");
                    setShowFilterDropdown(false);
                  }}
                >
                  All score-based sports
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
                    {sport.category ? (
                      <span className="scheduleFilterCategory">
                        ({sport.category})
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="scheduleTableWrap">
          <table className="scheduleTable">
            <thead>
              <tr>
                <th>Sport</th>
                <th>Participants</th>
                <th>Status</th>
                <th>{activeTab === "upcoming" ? "Starts At" : "Scoreboard"}</th>
              </tr>
            </thead>
            <tbody>
              {activeMatches.length === 0 ? (
                <tr>
                  <td colSpan="4" className="scheduleEmptyState">
                    {liveScoreMatches.length === 0
                      ? "No live-score matches have been created yet."
                      : `No ${activeTab} matches for the selected sport.`}
                  </td>
                </tr>
              ) : (
                activeMatches.map((match) => (
                  <tr key={match._id}>
                    <td>
                      <div className="scheduleSport">
                        <div className="scheduleSportIcon">
                          {SCHEDULE_SPORT_ICONS[match.sportId] ||
                            SCHEDULE_SPORT_ICONS.default}
                        </div>
                        <div>
                          <div className="scheduleSportName">
                            {match.sportName}
                          </div>
                          {match.sportCategory ? (
                            <div className="scheduleSportCategory">
                              {match.sportCategory}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="scheduleParticipants">
                        {match.participants.map((participant, index) => (
                          <div key={index} className="scheduleParticipant">
                            <span>{participant.name}</span>
                            {participant.registrationId ? (
                              <span className="scheduleParticipantId">
                                ({participant.registrationId})
                              </span>
                            ) : null}
                            {match.status === "finished" &&
                            match.winnerName === participant.name ? (
                              <span className="scheduleWinnerBadge">
                                🏆 Winner
                              </span>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`scheduleStatusBadge scheduleStatusBadge--${match.status}`}
                      >
                        {match.status === "ongoing"
                          ? "LIVE"
                          : match.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{renderScoreboard(match)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
