import { useEffect, useState } from "react";

import { getPublishedNotices } from "../services/api";

export function usePublishedNotices(limit = 20) {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadNotices() {
      setLoading(true);
      setError("");

      try {
        const response = await getPublishedNotices(limit);

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch notices");
        }

        if (!cancelled) {
          setNotices(response.data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Failed to fetch notices");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadNotices();

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { notices, loading, error };
}
