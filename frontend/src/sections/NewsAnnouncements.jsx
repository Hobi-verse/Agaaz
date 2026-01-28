import "./NewsAnnouncements.css";

// Helper function to calculate relative time
const getRelativeTime = (date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
  return date.toLocaleDateString();
};

const newsData = [
  {
    id: 1,
    text: "Registrations for Cricket has been closed.",
    timestamp: new Date("2026-01-28T07:00:00"),
  },
  {
    id: 2,
    text: "Inauguration on 29 Jan 2026 by Hon'ble VC,University of Lucknow",
    timestamp: new Date("2026-01-25T12:00:00"),
  },
  {
    id: 3,
    text: "Register by the 27th-lock in today's price before it goes up.",
    timestamp: new Date("2026-01-25T10:00:00"),
  },
  {
    id: 4,
    text: "No Registrations for Cricket after 27 Jan 2026",
    timestamp: new Date("2026-01-25T07:00:00"),
  },
];

export default function NewsAnnouncements() {
  return (
    <section className="newsSection" aria-label="News and Announcements">
      <h2 className="newsSectionTitle">📢 News & Announcements</h2>
      <div className="newsBox">
        <div className="newsScrollContainer">
          {newsData.map((news) => (
            <div key={news.id} className="newsItem">
              <span className="newsTagNew">New</span>
              <p className="newsItemText">{news.text}</p>
              <span className="newsTime">
                {getRelativeTime(news.timestamp)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
