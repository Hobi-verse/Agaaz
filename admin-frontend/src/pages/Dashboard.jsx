import { useEffect, useMemo, useState } from "react";

import DashboardHeader from "../components/DashboardHeader";
import PaginationControls from "../components/PaginationControls";
import RegistrationsFilters from "../components/RegistrationsFilters";
import RegistrationsTable from "../components/RegistrationsTable";
import { fetchRegistrations, fetchSportsList } from "../services/adminApi";

function normalizeSports(sportsMeta) {
  return (sportsMeta || [])
    .filter((s) => s && s.sportId && s.sportName)
    .map((s) => ({
      sportId: s.sportId,
      sportName: s.sportName,
      sportCategory: s.sportCategory,
      sportType: s.sportType,
    }));
}

export default function Dashboard() {
  const [registrations, setRegistrations] = useState([]);
  const [sportsMeta, setSportsMeta] = useState([]);

  const [sportId, setSportId] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);

  const sports = useMemo(() => normalizeSports(sportsMeta), [sportsMeta]);
  const totalPages = Math.max(Math.ceil((total || 0) / (limit || 1)), 1);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadSports() {
      try {
        const json = await fetchSportsList({ signal: controller.signal });
        if (!cancelled) setSportsMeta(json.data || []);
      } catch (e) {
        if (e?.name === "AbortError") return;
        // Keep dashboard usable even if sports list fails.
        if (!cancelled) console.warn(e);
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

    async function loadRegistrations() {
      setLoading(true);
      setError("");
      try {
        const json = await fetchRegistrations(
          { sportId, q: search, page, limit },
          { signal: controller.signal },
        );

        if (!cancelled) {
          setRegistrations(json.data || []);
          setTotal(json.total || 0);
          setCount(json.count || 0);
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (!cancelled) setError(e?.message || "Request failed");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadRegistrations();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [sportId, search, page, limit]);

  function onSportChange(nextSportId) {
    setSportId(nextSportId);
    setPage(1);
  }

  function onSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  function onLimitChange(value) {
    setLimit(value);
    setPage(1);
  }

  return (
    <div>
      <DashboardHeader count={count} total={total} />

      <RegistrationsFilters
        sports={sports}
        sportId={sportId}
        onSportChange={onSportChange}
        search={search}
        onSearchChange={onSearchChange}
        limit={limit}
        onLimitChange={onLimitChange}
        loading={loading}
      />

      <RegistrationsTable
        registrations={registrations}
        loading={loading}
        error={error}
      />

      <PaginationControls
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(p - 1, 1))}
        onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
      />
    </div>
  );
}
