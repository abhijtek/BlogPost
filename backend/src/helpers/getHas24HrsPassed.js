import nowMs from "./getCurrentTimeInMS.js";
import getDayStartFromUpdatedAt from "./getDayStartFromUpdatedAt.js";

export default function has24HoursPassedSinceDayStart(updatedAt) {
  const DAY_MS = 24 * 60 * 60 * 1000;

  const dayStartMs = getDayStartFromUpdatedAt(updatedAt);
  const currentMs = nowMs();

  return currentMs - dayStartMs >= DAY_MS;
}
