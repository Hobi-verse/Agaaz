import { useEffect, useState } from "react";

import DashboardHeader from "../components/DashboardHeader";
import {
  createNotice,
  fetchAdminNotices,
  updateNotice,
} from "../services/adminApi";

function formatDateTime(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleString();
}

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("published");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishingId, setPublishingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadNotices() {
    setLoading(true);
    setError("");
    try {
      const json = await fetchAdminNotices();
      setNotices(json.data || []);
    } catch (e) {
      setError(e?.message || "Failed to load notices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();

    if (!trimmed) {
      setError("Enter notice text before saving");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await createNotice({ text: trimmed, status });
      setText("");
      setStatus("published");
      setSuccess(
        status === "published"
          ? "Notice published successfully"
          : "Notice saved as draft",
      );
      await loadNotices();
    } catch (e) {
      setError(e?.message || "Failed to save notice");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(noticeId) {
    setPublishingId(noticeId);
    setError("");
    setSuccess("");

    try {
      await updateNotice({ noticeId, status: "published" });
      setSuccess("Draft published successfully");
      await loadNotices();
    } catch (e) {
      setError(e?.message || "Failed to publish notice");
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <div>
      <DashboardHeader count={notices.length} total={notices.length} />

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create notice
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Publish a notice to the public site or save it as a draft first.
            </p>
          </div>

          {success ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <label
              htmlFor="notice-text"
              className="block text-sm font-medium text-slate-700"
            >
              Notice text
            </label>
            <textarea
              id="notice-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the notice that should appear on the public website"
              maxLength={500}
              rows={4}
              disabled={saving}
              className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            />
            <p className="mt-1 text-xs text-slate-500">{text.length}/500</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="md:col-span-3">
              <label
                htmlFor="notice-status"
                className="block text-sm font-medium text-slate-700"
              >
                Save as
              </label>
              <select
                id="notice-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="md:col-span-3 md:self-end">
              <button
                type="submit"
                disabled={saving}
                className="h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              >
                {saving
                  ? "Saving…"
                  : status === "published"
                    ? "Publish notice"
                    : "Save draft"}
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent notices
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Published notices are visible on the public frontend.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-180 border-collapse text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="text-slate-700">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Notice
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Published
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Updated
                </th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-slate-600" colSpan={5}>
                    Loading notices…
                  </td>
                </tr>
              ) : notices.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-600" colSpan={5}>
                    No notices found.
                  </td>
                </tr>
              ) : (
                notices.map((notice) => (
                  <tr key={notice._id} className="align-top hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">
                      <p className="max-w-3xl whitespace-pre-wrap">
                        {notice.text}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold " +
                          (notice.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700")
                        }
                      >
                        {notice.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDateTime(notice.publishedAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDateTime(notice.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      {notice.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => handlePublish(notice._id)}
                          disabled={publishingId === notice._id}
                          className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm disabled:opacity-60"
                        >
                          {publishingId === notice._id
                            ? "Publishing…"
                            : "Publish"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">
                          Live on frontend
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
