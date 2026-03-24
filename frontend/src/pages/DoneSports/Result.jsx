import { useEffect, useMemo, useState } from "react";

import {
  getDateKey,
  getMatchStatus,
  getResultSportId,
} from "../../features/matches/utils";
import { getMatches } from "../../services/api";
import { eventDates, sportsConfig } from "./WinningData.js";
import "./Result.css";

const RESULT_SPORT_TABS = [
  { id: "cricket", name: "Cricket", icon: "🏏" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "volleyball", name: "Volleyball", icon: "🏐" },
  { id: "basketball", name: "Basketball", icon: "🏀" },
  { id: "tug_of_war", name: "Tug of War", icon: "🪢" },
  { id: "kho_kho", name: "Kho-Kho", icon: "🏃" },
  { id: "athletics", name: "Athletics", icon: "🏃‍♂️" },
  { id: "badminton", name: "Badminton", icon: "🏸" },
  { id: "chess", name: "Chess", icon: "♟️" },
  { id: "carrom", name: "Carrom", icon: "🎯" },
  { id: "table_tennis", name: "Table Tennis", icon: "🏓" },
  { id: "esports", name: "Esports", icon: "🎮" },
];

const RESULT_SPORT_META = Object.fromEntries(
  RESULT_SPORT_TABS.map((sport) => [sport.id, sport]),
);

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const Result = () => {
  const [selectedSport, setSelectedSport] = useState("cricket");
  const [selectedDate, setSelectedDate] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadMatches() {
      setLoading(true);
      setError("");

      try {
        const result = await getMatches();

        if (!result.success) {
          throw new Error(result.error || "Failed to load sports results");
        }

        if (!cancelled) {
          setMatches(result.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setMatches([]);
          setError(err?.message || "Failed to load sports results");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMatches();

    return () => {
      cancelled = true;
    };
  }, []);

  const individualSports = useMemo(
    () => sportsConfig.filter((sport) => sport.type === "individual"),
    [],
  );

  const allMatchResults = useMemo(() => {
    return (matches || []).map((match) => {
      const normalizedSportId = getResultSportId(match.sportId);
      const sportMeta = RESULT_SPORT_META[normalizedSportId] || {
        id: normalizedSportId,
        name: match.sportName || normalizedSportId,
        icon: "🏆",
      };
      const primaryDate = match.scheduledAt || match.createdAt;
      const participants = Array.isArray(match.participants)
        ? match.participants
        : [];

      return {
        id: match._id,
        sportId: normalizedSportId,
        sportName: sportMeta.name,
        sportIcon: sportMeta.icon,
        date: getDateKey(primaryDate),
        dateValue: primaryDate,
        participant1: {
          name: participants[0]?.name || "TBD",
          meta: participants[0]?.registrationId || "",
        },
        participant2: {
          name: participants[1]?.name || "TBD",
          meta: participants[1]?.registrationId || "",
        },
        winner: match.winnerName || "",
        status: getMatchStatus(match.status),
        scoreA: match.scoreA || "",
        scoreB: match.scoreB || "",
      };
    });
  }, [matches]);

  const allIndividualEvents = useMemo(() => {
    const events = [];

    individualSports.forEach((sport) => {
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
  }, [individualSports]);

  const filteredMatchResults = useMemo(() => {
    return allMatchResults.filter((match) => {
      const sportMatch =
        selectedSport === "all" || match.sportId === selectedSport;
      const dateMatch = selectedDate === "all" || match.date === selectedDate;
      const statusMatch =
        selectedStatus === "all" || match.status === selectedStatus;

      return sportMatch && dateMatch && statusMatch;
    });
  }, [allMatchResults, selectedSport, selectedDate, selectedStatus]);

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

  const stats = useMemo(() => {
    const totalMatchEvents = allMatchResults.length;
    const totalIndividualEvents = allIndividualEvents.length;
    const completed =
      allMatchResults.filter((match) => match.status === "completed").length +
      allIndividualEvents.filter((event) => event.status === "completed")
        .length;
    const upcoming =
      allMatchResults.filter((match) => match.status !== "completed").length +
      allIndividualEvents.filter((event) => event.status !== "completed")
        .length;
    const sportIds = new Set([
      ...allMatchResults.map((match) => match.sportId),
      ...allIndividualEvents.map((event) => event.sportId),
    ]);

    return {
      totalMatches: totalMatchEvents + totalIndividualEvents,
      completed,
      upcoming,
      totalSports: sportIds.size,
    };
  }, [allMatchResults, allIndividualEvents]);

  const hasActiveFilters =
    selectedSport !== "cricket" ||
    selectedDate !== "all" ||
    selectedStatus !== "all";

  const resetFilters = () => {
    setSelectedSport("cricket");
    setSelectedDate("all");
    setSelectedStatus("all");
  };

  return (
    <div className="resultSection">
      <div className="resultHeader">
        <h1 className="resultTitle">🏆 Sports Results</h1>
        <p className="resultSubtitle">
          View live match results from the admin dashboard and upcoming fixtures
          across all sports
        </p>
        {error ? <p className="resultMessageBanner">{error}</p> : null}
      </div>

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

      <div className="sports-tabs-container">
        <div className="scroll-hint">
          <span className="scroll-text">Swipe or scroll for more sports →</span>
        </div>
        <div className="sportsBar">
          {RESULT_SPORT_TABS.map((sport) => (
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
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        {hasActiveFilters ? (
          <button className="resetFilterBtn" onClick={resetFilters}>
            Reset Filters
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="resultTableWrap">
          <div className="noResults">
            <div className="noResultsIcon">⏳</div>
            <p className="noResultsText">Loading live match results</p>
            <p className="noResultsSubtext">
              The latest winners and fixtures are being fetched from the backend
            </p>
          </div>
        </div>
      ) : filteredMatchResults.length > 0 ? (
        <div className="resultTableWrap">
          <div className="resultTableContainer">
            <table className="resultTable">
              <thead>
                <tr>
                  <th>Sport</th>
                  <th>Date</th>
                  <th>Participant 1</th>
                  <th></th>
                  <th>Participant 2</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {filteredMatchResults.map((match) => (
                  <tr
                    key={match.id}
                    className={match.status === "upcoming" ? "upcomingRow" : ""}
                  >
                    <td>
                      <span className="sportBadge">
                        <span className="sportBadgeIcon">{match.sportIcon}</span>
                        {match.sportName}
                      </span>
                    </td>
                    <td>{formatDate(match.dateValue)}</td>
                    <td>
                      <div className="teamNameWrapper">
                        <span
                          className={`teamName ${
                            match.winner === match.participant1.name
                              ? "winnerTeam"
                              : ""
                          }`}
                        >
                          {match.participant1.name}
                        </span>
                        {match.participant1.meta ? (
                          <div className="participantMeta">
                            {match.participant1.meta}
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td>VS</td>
                    <td>
                      <div className="teamNameWrapper">
                        <span
                          className={`teamName ${
                            match.winner === match.participant2.name
                              ? "winnerTeam"
                              : ""
                          }`}
                        >
                          {match.participant2.name}
                        </span>
                        {match.participant2.meta ? (
                          <div className="participantMeta">
                            {match.participant2.meta}
                          </div>
                        ) : null}
                      </div>
                    </td>
                    <td>
                      {match.status === "completed" && match.winner ? (
                        <div className="resultOutcome">
                          <span className="winnerBadge">🏆 {match.winner}</span>
                          {match.scoreA || match.scoreB ? (
                            <div className="resultScore">
                              Score: {match.scoreA || 0} - {match.scoreB || 0}
                            </div>
                          ) : null}
                        </div>
                      ) : match.status === "ongoing" ? (
                        <span className="ongoingBadge">🔥 Ongoing</span>
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
      ) : null}

      {filteredIndividualEvents.length > 0 ? (
        <div style={{ marginTop: filteredMatchResults.length > 0 ? "32px" : "0" }}>
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
                  className={`individualResultStatus ${
                    event.status === "completed"
                      ? "statusCompleted"
                      : "statusUpcoming"
                  }`}
                >
                  {event.status === "completed"
                    ? "✅ Completed"
                    : "⏳ Upcoming"}
                </span>
              </div>
              {event.status === "upcoming" ? (
                <div className="noResults" style={{ padding: "30px 20px" }}>
                  <div className="noResultsIcon">🎯</div>
                  <p className="noResultsText">
                    Results will be updated after the event
                  </p>
                </div>
              ) : null}
              {event.status === "completed" &&
              event.results &&
              event.results.length > 0 ? (
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
                        <tr key={`${event.eventId}-${idx}`}>
                          <td>{result.position}</td>
                          <td>{result.name}</td>
                          <td>{result.college}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {!loading &&
      filteredMatchResults.length === 0 &&
      filteredIndividualEvents.length === 0 ? (
        <div className="resultTableWrap">
          <div className="noResults">
            <div className="noResultsIcon">🔍</div>
            <p className="noResultsText">No results found</p>
            <p className="noResultsSubtext">
              Try adjusting your filters to see more results
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Result;
