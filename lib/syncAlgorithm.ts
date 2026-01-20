import { SrtSubtitle } from "./types";

function msToTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  ms %= 3600000;
  const minutes = Math.floor(ms / 60000);
  ms %= 60000;
  const seconds = Math.floor(ms / 1000);
  ms %= 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function levenshtein(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

function findBestMatch(
  cue: SrtSubtitle,
  subs: SrtSubtitle[],
  searchWindow = 20
): number {
  let bestMatchIndex = -1;
  let minDistance = Infinity;

  // Allow some flexibility but reject very different strings
  // 40% of length as threshold, or at least 5 characters diff
  const threshold = Math.max(cue.text.length * 0.4, 5);

  for (let i = 0; i < Math.min(subs.length, searchWindow); i++) {
    const distance = levenshtein(cue.text, subs[i].text);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatchIndex = i;
    }
  }

  if (minDistance > threshold) {
      return -1;
  }

  return bestMatchIndex;
}

export function syncSubtitles(
  refSubs: SrtSubtitle[],
  targetSubs: SrtSubtitle[]
): SrtSubtitle[] {
  if (refSubs.length === 0 || targetSubs.length === 0) {
    return targetSubs;
  }

  const firstMatchRefIndex = 0;
  const matchIndex = findBestMatch(refSubs[0], targetSubs);
  const firstMatchTargetIndex = matchIndex;

  const lastMatchRefIndex = refSubs.length - 1;

  const lastTargetSlice = targetSubs.slice(Math.max(0, targetSubs.length - 20));
  const lastMatchIndexInSlice = findBestMatch(
    refSubs[refSubs.length - 1],
    lastTargetSlice
  );

  const lastMatchTargetIndex = lastMatchIndexInSlice !== -1
    ? lastMatchIndexInSlice + Math.max(0, targetSubs.length - 20)
    : -1;

  if (firstMatchTargetIndex === -1 || lastMatchTargetIndex === -1) {
    // If we can't find matches at start or end, we can't reliably sync.
    // Ideally we would try to find matches in the middle, but for now fallback.
    return targetSubs;
  }

  const refStartMs = refSubs[firstMatchRefIndex].startSeconds * 1000;
  const refEndMs = refSubs[lastMatchRefIndex].startSeconds * 1000;

  const targetStartMs = targetSubs[firstMatchTargetIndex].startSeconds * 1000;
  const targetEndMs = targetSubs[lastMatchTargetIndex].startSeconds * 1000;

  if (targetEndMs === targetStartMs) {
      return targetSubs;
  }

  const ratio = (refEndMs - refStartMs) / (targetEndMs - targetStartMs);
  const offset = refStartMs - targetStartMs * ratio;

  return targetSubs.map((line) => {
    const startMs = Math.round(line.startSeconds * 1000 * ratio + offset);
    const endMs = Math.round(line.endSeconds * 1000 * ratio + offset);
    return {
      ...line,
      startTime: msToTime(startMs),
      endTime: msToTime(endMs),
      // Update seconds as well to be consistent
      startSeconds: startMs / 1000,
      endSeconds: endMs / 1000
    };
  });
}
