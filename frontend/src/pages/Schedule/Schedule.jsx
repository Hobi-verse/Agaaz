import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

import {
  formatMatchDateTime,
  SCHEDULE_SPORT_ICONS,
  supportsLiveScore,
} from "../../features/matches/utils";
import { getEvents, getMatches, subscribeToMatchUpdates } from "../../services/api";
import "./Schedule.css";

const MATCH_STATUS = {
  ongoing: "ongoing",
  upcoming: "scheduled",
  completed: "finished",
};

const getMatchEventId = (match) => match.eventId || match.eventName || "existing";

const getSportIcon = (sportId, sportName) => {
  const knownIcon = SCHEDULE_SPORT_ICONS[sportId];
  if (knownIcon && knownIcon !== SCHEDULE_SPORT_ICONS.default) return knownIcon;

  const label = `${sportId || ""} ${sportName || ""}`.toLocaleLowerCase();
  const iconHints = [
    [/cricket/, "🏏"],
    [/football|soccer/, "⚽"],
    [/volley/, "🏐"],
    [/basket|hoop/, "🏀"],
    [/tug.?of.?war/, "🤼"],
    [/kho.?kho|athlet|track|long.?jump|run/, "🏃"],
    [/badminton/, "🏸"],
    [/chess/, "♟️"],
    [/carrom/, "🎯"],
    [/table.?tennis|ping.?pong|\btt\b/, "🏓"],
    [/esport|bgmi|free.?fire|clash.?royale|gaming/, "🎮"],
    [/cycl|bicycle/, "🚴"],
    [/swim/, "🏊"],
    [/weight.?lift/, "🏋️"],
    [/tennis/, "🎾"],
  ];

  return iconHints.find(([pattern]) => pattern.test(label))?.[1] || knownIcon || "🏆";
};

const Schedule = () => {
  const [searchParams] = useSearchParams();
  const [matches, setMatches] = useState([]);
  const [eventCollections, setEventCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(() => searchParams.get("event") || "all");

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
    getEvents().then((result) => {
      if (!cancelled && result.success) setEventCollections(result.data || []);
    });
    const unsubscribe = subscribeToMatchUpdates((updatedMatches) => {
      if (!cancelled) {
        setMatches(updatedMatches || []);
        setError(null);
      }
    });
    const intervalId = window.setInterval(() => fetchMatches(false), 15000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
      unsubscribe();
    };
  }, []);

  const scheduleMatches = matches;

  const matchesInSelectedEvent = useMemo(
    () => scheduleMatches.filter((match) => selectedEvent === "all" || getMatchEventId(match) === selectedEvent),
    [scheduleMatches, selectedEvent],
  );

  const sportsForEvent = useMemo(() => {
    const sportMap = new Map();

    eventCollections
      .filter((event) => selectedEvent === "all" || event.eventId === selectedEvent)
      .forEach((event) => {
        (event.sports || []).forEach((sport) => {
          if (!sportMap.has(sport.sportId)) {
            sportMap.set(sport.sportId, {
              id: sport.sportId,
              name: sport.sportName || sport.sportId,
              category: sport.sportCategory || "",
              eventName: event.eventName || "",
              icon: getSportIcon(sport.sportId, sport.sportName),
            });
          }
        });
      });

    matchesInSelectedEvent.forEach((match) => {
      if (!sportMap.has(match.sportId)) {
        sportMap.set(match.sportId, {
          id: match.sportId,
          name: match.sportName || match.sportId,
          category: match.sportCategory || "",
          eventName: match.eventName || "",
          icon: getSportIcon(match.sportId, match.sportName),
        });
      }
    });
    return Array.from(sportMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [eventCollections, matchesInSelectedEvent, selectedEvent]);

  const statusCounts = useMemo(() => {
    const counts = { ongoing: 0, upcoming: 0, completed: 0 };
    matchesInSelectedEvent.forEach((match) => {
      if (selectedSport !== "all" && match.sportId !== selectedSport) return;
      if (match.status === "ongoing") counts.ongoing += 1;
      if (match.status === "scheduled") counts.upcoming += 1;
      if (match.status === "finished") counts.completed += 1;
    });
    return counts;
  }, [matchesInSelectedEvent, selectedSport]);

  const activeMatches = useMemo(() => {
    const filteredMatches = matchesInSelectedEvent.filter((match) => {
      if (match.status !== MATCH_STATUS[activeTab]) return false;
      if (selectedSport !== "all" && match.sportId !== selectedSport) return false;
      return true;
    });

    return filteredMatches.sort((a, b) => {
      const dateA = new Date(a.liveScoreUpdatedAt || a.scheduledAt || a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.liveScoreUpdatedAt || b.scheduledAt || b.updatedAt || b.createdAt || 0).getTime();
      return activeTab === "upcoming" ? dateA - dateB : dateB - dateA;
    });
  }, [activeTab, matchesInSelectedEvent, selectedSport]);

  const availableSports = sportsForEvent
    .map((sport) => ({
      ...sport,
      count: matchesInSelectedEvent.filter(
        (match) => match.sportId === sport.id && match.status === MATCH_STATUS[activeTab],
      ).length,
    }));

  const repeatedSportNames = new Set(
    availableSports
      .filter((sport, index, sports) => sports.some((other, otherIndex) => otherIndex !== index && other.name.toLocaleLowerCase() === sport.name.toLocaleLowerCase()))
      .map((sport) => sport.name.toLocaleLowerCase()),
  );

  const clearFilters = () => {
    setSelectedEvent("all");
    setSelectedSport("all");
  };

  const renderScoreboard = (match) => {
    const [participantA, participantB] = match.participants || [];

    if (match.status === "scheduled") {
      const scheduleInfo = formatMatchDateTime(match.scheduledAt || match.createdAt);
      return (
        <div className="scheduleScheduledInfo">
          <span className="scheduleScheduledIcon" aria-hidden="true">◷</span>
          <div>
            <span className="scheduleScoreLabel">Scheduled start</span>
            <strong>{scheduleInfo.date === "-" ? "Time to be announced" : scheduleInfo.date}</strong>
            {scheduleInfo.time !== "-" ? <span>{scheduleInfo.time}</span> : null}
          </div>
        </div>
      );
    }

    if (!supportsLiveScore(match)) {
      return (
        <div className="scheduleResultOnly">
          {match.status === "ongoing" ? (
            <>
              <span className="scheduleScoreLabel">Match in progress</span>
              <strong>Result will be posted when available</strong>
            </>
          ) : (
            <>
              <span className="scheduleScoreLabel">Final result</span>
              <strong>{match.winnerName ? `${match.winnerName} won` : "Result pending"}</strong>
            </>
          )}
        </div>
      );
    }

    const updatedInfo = formatMatchDateTime(match.liveScoreUpdatedAt);
    const finalInfo = formatMatchDateTime(match.liveScoreUpdatedAt || match.updatedAt);

    return (
      <div className="scheduleResult">
        <div className="scheduleLiveScore" aria-label={`${participantA?.name || "Team 1"} ${match.scoreA ?? 0}, ${participantB?.name || "Team 2"} ${match.scoreB ?? 0}`}>
          <div className="scheduleLiveTeam">
            <span className="scheduleLiveTeamName">{participantA?.name || "Team 1"}</span>
            <strong className="scheduleLiveTeamValue">{match.scoreA ?? 0}</strong>
          </div>
          <span className="scheduleLiveSeparator" aria-hidden="true">:</span>
          <div className="scheduleLiveTeam">
            <span className="scheduleLiveTeamName">{participantB?.name || "Team 2"}</span>
            <strong className="scheduleLiveTeamValue">{match.scoreB ?? 0}</strong>
          </div>
        </div>

        <div className="scheduleLiveMeta">
          {match.status === "ongoing" ? (
            <>
              <span className="scheduleLiveIndicator"><span /> LIVE</span>
              <span>{match.liveScoreUpdatedAt ? `Updated ${updatedInfo.time}` : "Waiting for first score update"}</span>
            </>
          ) : (
            <>
              <span className="scheduleWinner">{match.winnerName ? `Winner · ${match.winnerName}` : "Final score"}</span>
              <span>{finalInfo.time !== "-" ? `Finalized ${finalInfo.time}` : "Completed"}</span>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="schedulePage">
        <div className="scheduleSection"><div className="scheduleStateCard">Loading live match scores…</div></div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="schedulePage">
        <div className="scheduleSection">
          <div className="scheduleStateCard scheduleStateCard--error">
            <p>We couldn&apos;t load the match board.</p>
            <span>{error}</span>
            <button type="button" className="scheduleRetryButton" onClick={() => window.location.reload()}>
              <FontAwesomeIcon icon={faRotateRight} /> Try again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="schedulePage">
      <div className="scheduleSection">
        <header className="scheduleHeader">
          <h1 className="scheduleTitle">Live Match Score</h1>
          <p className="scheduleSubtitle">
            Find a game by sport, team, or event and keep up with every live score.
          </p>
        </header>

        <section className="scheduleBoard" aria-label="Match score board">
          <div className="scheduleTabs" role="group" aria-label="Filter by match status">
            {[
              { id: "ongoing", label: "Live now", hint: "In play" },
              { id: "upcoming", label: "Upcoming", hint: "Starting soon" },
              { id: "completed", label: "Completed", hint: "Final scores" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                aria-pressed={activeTab === tab.id}
                className={`scheduleTab ${activeTab === tab.id ? "scheduleTabActive" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="scheduleTabText">
                  <span className="scheduleTabLabel">{tab.id === "ongoing" ? <span className="scheduleTabLiveDot" /> : null}{tab.label}</span>
                  <span className="scheduleTabHint">{tab.hint}</span>
                </span>
                <span className="scheduleTabCount">{statusCounts[tab.id]}</span>
              </button>
            ))}
          </div>

          <div className="scheduleSportBrowser" role="group" aria-label="Filter matches by sport">
            <div className="scheduleSportChips">
              <button
                type="button"
                className={`scheduleSportChip ${selectedSport === "all" ? "scheduleSportChipActive" : ""}`}
                aria-pressed={selectedSport === "all"}
                onClick={() => setSelectedSport("all")}
              >
                <span className="scheduleSportChipIcon" aria-hidden="true">🏆</span>
                <span className="scheduleSportChipName">All sports</span>
                <span className="scheduleSportChipCount">{statusCounts[activeTab]}</span>
              </button>
              {availableSports.map((sport) => (
                <button
                  key={sport.id}
                  type="button"
                  className={`scheduleSportChip ${selectedSport === sport.id ? "scheduleSportChipActive" : ""}`}
                  aria-pressed={selectedSport === sport.id}
                  onClick={() => setSelectedSport(sport.id)}
                >
                  <span className="scheduleSportChipIcon" aria-hidden="true">{sport.icon}</span>
                  <span className="scheduleSportChipName">{sport.name}</span>
                  {repeatedSportNames.has(sport.name.toLocaleLowerCase()) && sport.eventName ? (
                    <span className="scheduleSportChipEvent">{sport.eventName}</span>
                  ) : null}
                  <span className="scheduleSportChipCount">{sport.count}</span>
                </button>
              ))}
              {availableSports.length === 0 ? <span className="scheduleNoSports">No sports in this view yet.</span> : null}
            </div>
          </div>

          <div className="scheduleResultsHeader">
            <div>
              <h2>{activeTab === "ongoing" ? "Live matches" : activeTab === "upcoming" ? "Coming up" : "Final results"}</h2>
              <p>{selectedSport === "all" ? "Across all sports" : sportsForEvent.find((sport) => sport.id === selectedSport)?.name}</p>
            </div>
            <span className="scheduleResultsCount">{activeMatches.length} {activeMatches.length === 1 ? "match" : "matches"}</span>
          </div>

          {activeMatches.length === 0 ? (
            <div className="scheduleEmptyState">
              <span className="scheduleEmptyIcon" aria-hidden="true">⌕</span>
              <h3>{scheduleMatches.length === 0 ? "No matches have been added yet" : "No matches found"}</h3>
              <p>
                {scheduleMatches.length === 0
                  ? "When matches are scheduled, they will appear here."
                  : `There are no ${activeTab} matches for this sport or event.`}
              </p>
              {selectedEvent !== "all" || selectedSport !== "all" ? (
                <button type="button" className="scheduleClearFilters" onClick={clearFilters}>Clear filters</button>
              ) : null}
            </div>
          ) : (
            <div className="scheduleMatchGrid" aria-live={activeTab === "ongoing" ? "polite" : "off"}>
              {activeMatches.map((match) => (
                <article key={match._id} className={`scheduleMatchCard scheduleMatchCard--${match.status}`}>
                  <div className="scheduleMatchSportTile">
                    <span className="scheduleMatchSportIcon" aria-hidden="true">
                      {getSportIcon(match.sportId, match.sportName)}
                    </span>
                    <h3>{match.sportName || "Sport"}</h3>
                    {match.sportCategory ? <span className="scheduleMatchSportCategory">{match.sportCategory}</span> : null}
                  </div>

                  <div className="scheduleMatchDetails">
                    <div className="scheduleMatchInfoRow">
                      {match.eventName ? <div className="scheduleMatchEvent"><span />{match.eventName}</div> : <span />}
                      <span className={`scheduleStatusBadge scheduleStatusBadge--${match.status}`}>
                        {match.status === "ongoing" ? <span className="scheduleTabLiveDot" /> : null}
                        {match.status === "ongoing" ? "Live" : match.status === "scheduled" ? "Upcoming" : "Final"}
                      </span>
                    </div>

                    <div className="scheduleMatchScoreboard">{renderScoreboard(match)}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Schedule;
