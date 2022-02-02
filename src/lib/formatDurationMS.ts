export const formatDurationMS = (duration_ms: number): string => {
  const seconds = Math.floor(duration_ms / 1000) % 60;
  const minutes = Math.floor(duration_ms / 1000 / 60);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
