export function localizeNotif(text: string, lang: string): string {
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      if (lang === "ar") return String(parsed.ar ?? parsed.en ?? text);
      return String(parsed.en ?? parsed.ar ?? text);
    }
  } catch {
    // not JSON — plain string
  }
  return text;
}
