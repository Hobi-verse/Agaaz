import { LIVE_SCORE_SPORTS } from "./constants";

export function participantLabel(participant) {
  return participant?.name || "-";
}

export function formatMatchStatus(status) {
  return status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Scheduled";
}

export function supportsLiveScore(sportId) {
  return LIVE_SCORE_SPORTS.has(sportId);
}

export function getParticipantPayload(registrationId, customName) {
  return registrationId === "others"
    ? { name: customName.trim() }
    : { registrationId };
}

export function validateMatchParticipants(participantA, participantB) {
  if (!participantA.registrationId && !participantA.name) {
    return "Select or enter Student A";
  }

  if (!participantB.registrationId && !participantB.name) {
    return "Select or enter Student B";
  }

  if (
    participantA.registrationId &&
    participantB.registrationId &&
    participantA.registrationId === participantB.registrationId
  ) {
    return "Students must be different";
  }

  if (
    participantA.name &&
    participantB.name &&
    participantA.name === participantB.name
  ) {
    return "Students must be different";
  }

  return "";
}

export function formatScheduledDateTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return {
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  };
}
