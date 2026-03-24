export function normalizeSports(sportsMeta = []) {
  return sportsMeta
    .filter((sport) => sport?.sportId && sport?.sportName)
    .map((sport) => ({
      sportId: sport.sportId,
      sportName: sport.sportName,
      sportCategory: sport.sportCategory,
      sportType: sport.sportType,
    }));
}
