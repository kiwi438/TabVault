export function parseUrl(raw: string) {
  const trimmed = raw.trim();
  const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(url);

    return {
      url: parsed.href,
      domain: parsed.hostname.replace("www.", ""),
      favicon: `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`,
    };
  } catch {
    return null;
  }
}

// Добавить возможность парсить просто заметки
// Они могут работать в качестве разделителя
