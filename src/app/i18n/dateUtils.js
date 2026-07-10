const LOCALE_MAP = {
  va: "ca-ES",
  oc: "oc-FR",
};

export function formatDate(date, locale) {
  const d = date instanceof Date ? date : new Date(date);
  const lang = LOCALE_MAP[locale] ?? locale;
  return d.toLocaleDateString(lang, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
}
