import "./NewsAnnouncements.css";
import { getRelativeTime, isRecentNotice } from "./noticeUtils";
import { usePublishedNotices } from "./usePublishedNotices";

export default function NewsAnnouncements() {
  const { notices, loading, error } = usePublishedNotices(20);

  return (
    <section className="newsSection" aria-label="News and Announcements">
      <h2 className="newsSectionTitle">📢 News & Announcements</h2>
      <div className="newsBox">
        <div className="newsScrollContainer">
          {loading ? (
            <p className="newsState">Loading announcements…</p>
          ) : error ? (
            <p className="newsState newsStateError">{error}</p>
          ) : notices.length === 0 ? (
            <p className="newsState">No announcements have been published yet.</p>
          ) : (
            notices.map((notice) => {
              const timestamp = notice.publishedAt || notice.createdAt;
              return (
                <div key={notice._id} className="newsItem">
                  <span className="newsTagNew">
                    {isRecentNotice(timestamp) ? "New" : "Notice"}
                  </span>
                  <p className="newsItemText">{notice.text}</p>
                  <span className="newsTime">{getRelativeTime(timestamp)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
