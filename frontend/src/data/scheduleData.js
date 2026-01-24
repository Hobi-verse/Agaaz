export const schedulePage = {
  title: "EVENT SCHEDULE",
  subtitle: "Plan your days. Don't miss the action.",
  eventDates: "31st Jan, 1st Feb & 2nd Feb 2026",
  days: [
    { key: "day1", label: "DAY 1: JAN 31" },
    { key: "day2", label: "DAY 2: FEB 1" },
    { key: "day3", label: "DAY 3: FEB 2" },
  ],
};

export const scheduleByDay = {
  day1: [
    // { time: "9:00 AM", sport: "Basketball", type: "Men's Qualifier", venue: "Main Court" },
    { time: "10:30 AM", sport: "Cricket", type: "Group A Match", venue: "Stadium Pitch 1" },
    { time: "11:30 AM", sport: "Football", type: "Group A Match", venue: "Stadium Pitch 2" },
    { time: "11:00 AM", sport: "Badminton", type: "Men's Qualifier", venue: "Stadium Pitch 1" },
    { time: "12:30 PM", sport: "Cricket", type: "Group A Match", venue: "Stadium Pitch 1" },
    { time: "12:30 PM", sport: "Football", type: "Group A Match", venue: "Stadium Pitch 1" },
    { time: "1:30 PM", sport: "Cricket", type: "Group A Match", venue: "Stadium Pitch 1" },
  ],
  day2: [
    // { time: "9:00 AM", sport: "Basketball", type: "Women's Qualifier", venue: "Main Court" },
    { time: "10:30 AM", sport: "Badminton", type: "Group Stage", venue: "Indoor Hall" },
    { time: "11:30 AM", sport: "Football", type: "Group B Match", venue: "Stadium Pitch 2" },
    { time: "1:00 PM", sport: "Cricket", type: "Group B Match", venue: "Stadium Pitch 1" },
  ],
  day3: [
    { time: "9:30 AM", sport: "Athletics", type: "Heats", venue: "Track" },
    // { time: "11:00 AM", sport: "Basketball", type: "Final", venue: "Main Court" },
    { time: "12:30 PM", sport: "Football", type: "Final", venue: "Stadium Pitch 2" },
    { time: "2:00 PM", sport: "Cricket", type: "Final", venue: "Stadium Pitch 1" },
  ],
};
