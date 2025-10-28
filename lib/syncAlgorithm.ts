import { SrtSubtitle } from "./types";

function timeToMs(time: string): number {
  const parts = time.split(/[:,]/);
  return (
    parseInt(parts[0]) * 3600000 +
    parseInt(parts[1]) * 60000 +
    parseInt(parts[2]) * 1000 +
    parseInt(parts[3])
  );
}

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

  for (let i = 0; i < Math.min(subs.length, searchWindow); i++) {
    const distance = levenshtein(cue.text, subs[i].text);
    if (distance < minDistance) {
      minDistance = distance;
      bestMatchIndex = i;
    }
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
  const firstMatchTargetIndex = findBestMatch(refSubs[0], targetSubs);

  const lastMatchRefIndex = refSubs.length - 1;
  const lastMatchTargetIndex = findBestMatch(
    refSubs[refSubs.length - 1],
    targetSubs.slice(Math.max(0, targetSubs.length - 20))
  ) + Math.max(0, targetSubs.length - 20);

  if (firstMatchTargetIndex === -1 || lastMatchTargetIndex === -1) {
    return targetSubs; // No matches found
  }

  const refStartMs = timeToMs(refSubs[firstMatchRefIndex].startTime);
  const refEndMs = timeToMs(refSubs[lastMatchRefIndex].startTime);

  const targetStartMs = timeToMs(
    targetSubs[firstMatchTargetIndex].startTime
  );
  const targetEndMs = timeToMs(targetSubs[lastMatchTargetIndex].startTime);

  const ratio = (refEndMs - refStartMs) / (targetEndMs - targetStartMs);
  const offset = refStartMs - targetStartMs * ratio;

  return targetSubs.map((line) => {
    const startMs = timeToMs(line.startTime) * ratio + offset;
    const endMs = timeToMs(line.endTime) * ratio + offset;
    return {
      ...line,
      startTime: msToTime(startMs),
      endTime: msToTime(endMs),
    };
  });
}
