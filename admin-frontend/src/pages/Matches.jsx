import { useCallback, useEffect, useMemo, useState } from "react";

import DashboardHeader from "../components/DashboardHeader";
import CreateMatchSection from "../features/matches/CreateMatchSection";
import MatchesTable from "../features/matches/MatchesTable";
import {
  getParticipantPayload,
  validateMatchParticipants,
} from "../features/matches/utils";
import {
  createMatch,
  fetchMatchParticipants,
  fetchMatches,
  fetchSportsList,
  setMatchResult,
  updateLiveMatchScore,
  updateMatchStatus,
} from "../services/adminApi";
import { normalizeSports } from "../utils/sports";

export default function Matches({ user }) {
  const [sportsMeta, setSportsMeta] = useState([]);

  const [listSportId, setListSportId] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState("");

  const [createSportId, setCreateSportId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  const [registrationIdA, setRegistrationIdA] = useState("");
  const [registrationIdB, setRegistrationIdB] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [customNameA, setCustomNameA] = useState("");
  const [customNameB, setCustomNameB] = useState("");

  const [scheduledAt, setScheduledAt] = useState("");

  const [resultSavingId, setResultSavingId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [liveScoreSavingId, setLiveScoreSavingId] = useState(null);

  const [scoreA, setScoreA] = useState({});
  const [scoreB, setScoreB] = useState({});

  const assignedSports = useMemo(() => user?.assignedSports ?? [], [user]);
  const sports = useMemo(
    () =>
      normalizeSports(sportsMeta).filter((s) =>
        assignedSports.includes(s.sportId),
      ),
    [sportsMeta, assignedSports],
  );

  const loadMatches = useCallback(
    async (activeSportId, { signal } = {}) => {
      const json = await fetchMatches(
        { sportId: activeSportId, page: 1, limit: 200 },
        { signal },
      );
      const fetchedMatches = json.data || [];

      if (activeSportId) {
        return fetchedMatches;
      }

      return fetchedMatches.filter((match) =>
        assignedSports.includes(match.sportId),
      );
    },
    [assignedSports],
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadSports() {
      try {
        const json = await fetchSportsList({ signal: controller.signal });
        if (!cancelled) setSportsMeta(json.data || []);
      } catch (e) {
        if (e?.name === "AbortError") return;
      }
    }

    loadSports();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadMatches() {
      setMatchesLoading(true);
      setMatchesError("");
      try {
        const filteredMatches = await loadMatches(listSportId, {
          signal: controller.signal,
        });
        if (!cancelled) {
          setMatches(filteredMatches);
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (!cancelled) setMatchesError(e?.message || "Failed to load matches");
      } finally {
        if (!cancelled) setMatchesLoading(false);
      }
    }

    loadMatches();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [listSportId, loadMatches]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadParticipants() {
      setParticipants([]);
      setRegistrationIdA("");
      setRegistrationIdB("");

      if (!createSportId) return;

      setParticipantsLoading(true);
      try {
        const json = await fetchMatchParticipants(
          { sportId: createSportId },
          { signal: controller.signal },
        );
        if (!cancelled) setParticipants(json.data || []);
      } catch (e) {
        if (e?.name === "AbortError") return;
      } finally {
        if (!cancelled) setParticipantsLoading(false);
      }
    }

    loadParticipants();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [createSportId]);

  const reloadMatches = useCallback(
    async (activeSportId = listSportId) => {
      const filteredMatches = await loadMatches(activeSportId);
      setMatches(filteredMatches);
    },
    [listSportId, loadMatches],
  );

  async function onCreateMatch() {
    setCreateError("");
    if (!createSportId) {
      setCreateError("Select a sport first");
      return;
    }

    const participantA = getParticipantPayload(registrationIdA, customNameA);
    const participantB = getParticipantPayload(registrationIdB, customNameB);
    const validationError = validateMatchParticipants(
      participantA,
      participantB,
    );

    if (validationError) {
      setCreateError(validationError);
      return;
    }

    setCreateLoading(true);
    try {
      const selectedSport = sports.find((s) => s.sportId === createSportId);
      await createMatch({
        sportId: createSportId,
        sportName: selectedSport?.sportName || "",
        sportCategory: selectedSport?.sportCategory || "",
        registrationIdA: participantA.registrationId || "",
        nameA: participantA.name || "",
        registrationIdB: participantB.registrationId || "",
        nameB: participantB.name || "",
        scheduledAt: scheduledAt || null,
      });

      await reloadMatches();

      // Reset selection
      setRegistrationIdA("");
      setRegistrationIdB("");
      setCustomNameA("");
      setCustomNameB("");
      setScheduledAt("");
    } catch (e) {
      setCreateError(e?.message || "Failed to create match");
    } finally {
      setCreateLoading(false);
    }
  }

  async function onSetWinner(matchId, winnerRegistrationId, winnerName) {
    const matchScoreA = scoreA[matchId] || null;
    const matchScoreB = scoreB[matchId] || null;
    setResultSavingId(matchId);
    try {
      await setMatchResult({
        matchId,
        winnerRegistrationId,
        winnerName,
        scoreA: matchScoreA,
        scoreB: matchScoreB,
      });
      await reloadMatches();
      // Clear scores
      setScoreA((prev) => ({ ...prev, [matchId]: undefined }));
      setScoreB((prev) => ({ ...prev, [matchId]: undefined }));
    } catch (e) {
      setMatchesError(e?.message || "Failed to set result");
    } finally {
      setResultSavingId(null);
    }
  }

  async function onUpdateLiveScore(matchId) {
    const matchScoreA = scoreA[matchId] || null;
    const matchScoreB = scoreB[matchId] || null;
    setLiveScoreSavingId(matchId);
    try {
      await updateLiveMatchScore({
        matchId,
        scoreA: matchScoreA,
        scoreB: matchScoreB,
      });
      await reloadMatches();
    } catch (e) {
      setMatchesError(e?.message || "Failed to update live score");
    } finally {
      setLiveScoreSavingId(null);
    }
  }

  async function onStartMatch(matchId) {
    setStatusUpdatingId(matchId);
    try {
      await updateMatchStatus({ matchId, status: "ongoing" });
      await reloadMatches();
    } catch (e) {
      setMatchesError(e?.message || "Failed to start match");
    } finally {
      setStatusUpdatingId(null);
    }
  }

  return (
    <div>
      <DashboardHeader count={matches.length} total={matches.length} />

      <CreateMatchSection
        createError={createError}
        createLoading={createLoading}
        createSportId={createSportId}
        customNameA={customNameA}
        customNameB={customNameB}
        onCreateMatch={onCreateMatch}
        onCreateSportChange={setCreateSportId}
        onCustomNameAChange={setCustomNameA}
        onCustomNameBChange={setCustomNameB}
        onRegistrationAChange={setRegistrationIdA}
        onRegistrationBChange={setRegistrationIdB}
        onScheduledAtChange={setScheduledAt}
        participants={participants}
        participantsLoading={participantsLoading}
        registrationIdA={registrationIdA}
        registrationIdB={registrationIdB}
        scheduledAt={scheduledAt}
        sports={sports}
      />

      <MatchesTable
        listSportId={listSportId}
        liveScoreSavingId={liveScoreSavingId}
        matches={matches}
        matchesError={matchesError}
        matchesLoading={matchesLoading}
        onFilterSportChange={setListSportId}
        onSetWinner={onSetWinner}
        onStartMatch={onStartMatch}
        onUpdateLiveScore={onUpdateLiveScore}
        resultSavingId={resultSavingId}
        scoreA={scoreA}
        scoreB={scoreB}
        setScoreA={setScoreA}
        setScoreB={setScoreB}
        sports={sports}
        statusUpdatingId={statusUpdatingId}
      />
    </div>
  );
}
