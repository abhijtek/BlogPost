export default function getDayStartFromUpdatedAt(updatedAt) {
  const d = new Date(updatedAt);  // copy updatedAt
  d.setHours(0, 0, 0, 0);      // reset to start of THAT day (local)
  return d.getTime();             // milliseconds
}
