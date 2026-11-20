// Romance Additions §9.2: three lines; the last starts at the emphasis word ("opens").
function halve(words: string[]): [string[], string[]] {
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(
      words.slice(0, i).join(' ').length - words.slice(i).join(' ').length,
    );
    if (diff < bestDiff) [best, bestDiff] = [i, diff];
  }
  return [words.slice(0, best), words.slice(best)];
}

export function splitBloomLines(
  line: string,
  emphasis = 'opens',
): [string, string, string] {
  const words = line.trim().split(/\s+/).filter(Boolean);
  if (words.length < 3) return [words[0] ?? '', words[1] ?? '', ''];
  const clean = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  let cut = words.findIndex((w) => clean(w) === emphasis.toLowerCase());
  if (cut < 2) cut = Math.max(2, Math.round((words.length * 2) / 3));
  const [a, b] = halve(words.slice(0, cut));
  return [a.join(' '), b.join(' '), words.slice(cut).join(' ')];
}
