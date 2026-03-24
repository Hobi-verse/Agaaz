export const LIVE_SCORE_SPORTS = new Set([
  "cricket",
  "football",
  "volleyball",
  "basketball",
  "kho_kho",
  "tug_of_war",
  "badminton_singles",
  "badminton_doubles",
  "badminton_mixed",
  "tt_singles",
  "tt_doubles",
  "tt_mixed",
  "carrom",
  "carrom_singles",
]);

export const SCHEDULE_SPORT_ICONS = {
  cricket: "🏏",
  tug_of_war: "🤼",
  kho_kho: "🏃",
  volleyball: "🏐",
  basketball: "🏀",
  football: "⚽",
  carrom: "🎯",
  carrom_singles: "🎯",
  badminton_singles: "🏸",
  badminton_doubles: "🏸",
  badminton_mixed: "🏸",
  tt_singles: "🏓",
  tt_doubles: "🏓",
  tt_mixed: "🏓",
  default: "🏆",
};

export function supportsLiveScore(sportId) {
  return LIVE_SCORE_SPORTS.has(sportId);
}

export function formatMatchDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
}

export function getResultSportId(sportId) {
  if (!sportId) {
    return "all";
  }

  if (
    sportId.startsWith("athletics_") ||
    sportId === "cycling" ||
    sportId === "weightlifting"
  ) {
    return "athletics";
  }

  if (sportId.startsWith("badminton_")) {
    return "badminton";
  }

  if (sportId.startsWith("tt_")) {
    return "table_tennis";
  }

  if (sportId.startsWith("carrom_")) {
    return "carrom";
  }

  if (["bgmi", "free_fire", "clash_royale"].includes(sportId)) {
    return "esports";
  }

  return sportId;
}

export function getMatchStatus(status) {
  if (status === "finished") {
    return "completed";
  }

  if (status === "ongoing") {
    return "ongoing";
  }

  return "upcoming";
}

export function getDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
