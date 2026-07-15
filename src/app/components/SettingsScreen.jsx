import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Link,
  Info,
  Smartphone,
  Sun,
  Moon,
  Languages,
  Trophy,
} from "lucide-react";
import { useTheme } from "next-themes";
import { ScreenLayout } from "./ScreenLayout";
import { ContextualHelp } from "./ContextualHelp";
import { TutorialOverlay } from "./TutorialOverlay";
import { TUTORIALS } from "../data/tutorialContent";
import { useI18n } from "../context/I18nContext";
import { LOCALE_NAMES, LOCALE_FLAGS } from "../i18n/translations";
import { useTutorial } from "../context/TutorialContext";
import { ConfirmDialog } from "./ConfirmDialog";

const APP_VERSION = "1.0.0";

const LOCALE_LIST = ["es", "ca", "eu", "gl", "va", "oc"];

function FlagIcon({ locale }) {
  return (
    <span
      className="inline-block rounded overflow-hidden flex-shrink-0"
      style={{ width: 24, height: 16 }}
      dangerouslySetInnerHTML={{ __html: LOCALE_FLAGS[locale] }}
    />
  );
}

export function SettingsScreen() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale } = useI18n();
  const [langOpen, setLangOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { completedCount, totalTutorials, progressPercent, resetAll } = useTutorial();

  const handleLocaleSelect = (loc) => {
    if (loc === "es") {
      setLocale(loc);
      setLangOpen(false);
    } else {
      setPendingLocale(loc);
    }
  };

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <ScreenLayout scrollable={false}>
      <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm min-h-[64px] flex items-center">
        <div className="w-11 shrink-0 flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center text-[#659B35] hover:text-[#207041] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            aria-label={t("back")}
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
          <div className="flex flex-col items-center min-w-0">
            <h1 className="text-gray-700 dark:text-gray-200 text-lg font-semibold text-center truncate leading-tight w-full">
              {t("settings.title")}
            </h1>
          </div>
          <button
            onClick={() => setShowGuide(true)}
            className="w-7 h-7 rounded-full border border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] hover:bg-[#659B35] hover:text-white dark:hover:bg-[#85C34A] dark:hover:text-gray-900 flex items-center justify-center transition-colors shrink-0 text-xs font-bold"
            aria-label={t("settings.help")}
          >
            ?
          </button>
        </div>
        <div className="w-11 shrink-0" />
      </div>

      <div className="flex-1 overflow-y-scroll pb-16 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        <div className="bg-white dark:bg-gray-800 px-4 py-4 mb-3">
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 uppercase tracking-wide">
          {t("settings.preferences")}
        </h2>
        <div className="space-y-1">
          <button
            onClick={toggleDarkMode}
            data-tutorial="settings-apariencia"
            className="w-full flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                {theme === "dark" ? (
                  <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon size={20} className="text-gray-600" />
                )}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {theme === "dark"
                    ? t("settings.lightMode")
                    : t("settings.darkMode")}
                </div>
                <div className="text-xs text-gray-500">
                  {t("settings.appearance")}
                </div>
              </div>
            </div>
            <div
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${theme === "dark" ? "bg-[#659B35]" : "bg-gray-300"}`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}
              />
            </div>
          </button>

          <button
            onClick={() => setLangOpen(!langOpen)}
            data-tutorial="settings-idioma"
            className="w-full flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Languages
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {t("settings.languages")}
                </div>
                <div className="text-xs text-gray-500">
                  {t("settings.languagesDescription")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FlagIcon locale={locale} />
              <ChevronRight
                size={18}
                className={`text-gray-400 transition-transform ${langOpen ? "rotate-90" : ""}`}
              />
            </div>
          </button>

          {langOpen && (
            <div className="pl-11 space-y-1">
              {LOCALE_LIST.map((loc) => {
                const isActive = loc === locale;
                return (
                  <button
                    key={loc}
                    onClick={() => handleLocaleSelect(loc)}
                    className={`w-full flex items-center justify-between py-2.5 px-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#E3EB7A]/30 dark:bg-[#E3EB7A]/10 text-[#207041] dark:text-[#85C34A]"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FlagIcon locale={loc} />
                      <span className="text-sm font-medium">
                        {LOCALE_NAMES[loc]}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 rounded-full bg-[#659B35]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 px-4 py-4 mb-3">
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 uppercase tracking-wide">
          {t("settings.support")}
        </h2>
        <div className="space-y-1">
          <button
            onClick={() => alert(t("settings.helpAlert"))}
            className="w-full flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <HelpCircle
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {t("settings.help")}
                </div>
                <div className="text-xs text-gray-500">
                  {t("settings.helpDescription")}
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button
            onClick={() => alert(t("settings.usefulLinksAlert"))}
            className="w-full flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Link size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {t("settings.usefulLinks")}
                </div>
                <div className="text-xs text-gray-500">
                  {t("settings.usefulLinksDescription")}
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 px-4 py-4 mb-3" data-tutorial="settings-info">
        <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 uppercase tracking-wide">
          {t("settings.about")}
        </h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between py-3 px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Info size={20} className="text-gray-600 dark:text-gray-300" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {t("settings.version")}
                </div>
                <div className="text-xs text-gray-500">{APP_VERSION}</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between py-3 px-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Smartphone
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {t("settings.platform")}
                </div>
                <div className="text-xs text-gray-500">
                  {t("settings.platformName")}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#CCCCCC] dark:border-gray-700">
          <p className="text-xs text-gray-400 leading-relaxed">
            {t("settings.footer")}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 px-4 py-4 mb-3">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} className="text-[#659B35]" />
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">
            Tutoriales
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#65A83E] animate-progress-bar"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 shrink-0">
            {completedCount}/{totalTutorials}
          </span>
        </div>
        <button
          onClick={resetAll}
          className="mt-2 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline underline-offset-2 transition-colors"
        >
          ↻ Reiniciar tutoriales
        </button>
      </div>

      <div className="text-center py-4 text-xs text-gray-500">
        {t("settings.copyright")}
      </div>
      </div>
      </div>

      <ConfirmDialog
        open={pendingLocale !== null}
        title={t("language.warning.title")}
        message={t("language.warning.message")}
        onCancel={() => setPendingLocale(null)}
        onConfirm={() => {
          if (pendingLocale) {
            setLocale(pendingLocale);
            setLangOpen(false);
            setPendingLocale(null);
          }
        }}
      />

      <ContextualHelp
        helpKey="settings"
        open={showGuide}
        onClose={() => setShowGuide(false)}
        onStartTutorial={() => { setShowGuide(false); setShowTutorial(true); }}
      />

      {showTutorial && (
        <TutorialOverlay
          steps={TUTORIALS.ajustes.steps}
          tutorialTitle={TUTORIALS.ajustes.title}
          tutorialKey="ajustes"
          onClose={() => setShowTutorial(false)}
          onQuickGuide={() => { setShowTutorial(false); setShowGuide(true); }}
        />
      )}
    </ScreenLayout>
  );
}
