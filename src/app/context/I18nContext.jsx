import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { getTranslation, LOCALE_NAMES } from "../i18n/translations";
import { formatDate as formatDateFn } from "../i18n/dateUtils";

const STORAGE_KEY = "app-locale";

const I18nContext = createContext(null);

function getInitialLocale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ["es", "ca", "eu", "gl", "va", "oc"].includes(stored)) {
      return stored;
    }
  } catch {}
  return "es";
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(getInitialLocale);

  const setLocale = useCallback((newLocale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {}
  }, []);

  const t = useCallback((key) => getTranslation(locale, key), [locale]);

  const formatDate = useCallback(
    (date) => formatDateFn(date, locale),
    [locale],
  );

  useEffect(() => {
    document.documentElement.lang = locale === "oc" ? "oc" : locale;
  }, [locale]);

  const value = {
    locale,
    setLocale,
    t,
    localeName: LOCALE_NAMES[locale],
    formatDate,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return ctx;
}
