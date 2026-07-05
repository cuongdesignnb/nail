export function normalizeUnicodeText(value: string): string {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/\r\n/g, "\n")
    .replace(/\u0000/g, "")
    .trim();
}

export function normalizeKeyword(value: string): string {
  return normalizeUnicodeText(value).replace(/\s+/g, " ").toLocaleLowerCase();
}

export function parseKeywordInput(input: string) {
  const rawItems = normalizeUnicodeText(input)
    .split(/[\n,;\t]+/)
    .map((item) => normalizeUnicodeText(item))
    .filter(Boolean);

  const seen = new Set<string>();
  const keywords: Array<{ keyword: string; normalizedKeyword: string }> = [];
  const duplicates: string[] = [];

  for (const keyword of rawItems) {
    const normalizedKeyword = normalizeKeyword(keyword);
    if (!normalizedKeyword) continue;
    if (seen.has(normalizedKeyword)) {
      duplicates.push(keyword);
      continue;
    }
    seen.add(normalizedKeyword);
    keywords.push({ keyword, normalizedKeyword });
  }

  return {
    keywords,
    duplicateCount: duplicates.length,
    duplicates,
    rawCount: rawItems.length,
  };
}
