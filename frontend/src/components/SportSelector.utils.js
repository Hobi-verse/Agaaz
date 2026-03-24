import { getSportById, sportsData } from "../data/sportsData";

export function getAvailableSports(selectedCategory, excludedSportIds = []) {
  if (!selectedCategory) {
    return [];
  }

  const category = sportsData.find((item) => item.id === selectedCategory);
  if (!category) {
    return [];
  }

  return category.sports.filter(
    (sport) => !excludedSportIds.includes(sport.id),
  );
}

export function resolveSelectedSport(sportId, hasSubTypes) {
  if (!sportId || hasSubTypes) {
    return null;
  }

  return getSportById(sportId);
}

export function resolveSelectedSubType(subTypeId) {
  return subTypeId ? getSportById(subTypeId) : null;
}
