import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  Fingerprint,
  Eye,
  EyeOff,
  Linkedin,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { LOCALE_FLAGS, LOCALE_NAMES } from "../i18n/translations";
import { ConfirmDialog } from "./ConfirmDialog";
import adifLogo from "../imports/logoLight.png";

const LOCALE_LIST = ["es", "ca", "eu", "gl", "va", "oc"];

function FlagIcon({ locale: loc }) {
  return (
    <span
      className="inline-block rounded overflow-hidden flex-shrink-0"
      style={{ width: 24, height: 16 }}
      dangerouslySetInnerHTML={{ __html: LOCALE_FLAGS[loc] }}
    />
  );
}

export function LoginScreen() {
  const { login } = useAuth();
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const [pendingLocale, setPendingLocale] = useState(null);
  const langRef = useRef(null);

  const handleLocaleSelect = (loc) => {
    if (loc === "es") {
      setLocale(loc);
      setLangOpen(false);
    } else {
      setPendingLocale(loc);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    setError("");
    login(username, password);
    navigate("/", { replace: true });
  };

  useEffect(() => {
    if (!langOpen) return;
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#F5F5F5] dark:bg-gray-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <img
            src={adifLogo}
            alt="ADIF"
            className="h-16 mx-auto dark:brightness-0 dark:invert"
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-bold text-[#207041] dark:text-[#85C34A] mb-6">
            {t("login.title")}
          </h1>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t("login.username")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#659B35] dark:text-[#85C34A]">
                  <User size={18} />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder={t("login.usernamePlaceholder")}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-[#CCCCCC] dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A] focus:border-transparent"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {t("login.password")}
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#659B35] dark:text-[#85C34A]">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-[#CCCCCC] dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A] focus:border-transparent"
                  required
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                  aria-label={
                    showPassword
                      ? t("login.hidePassword")
                      : t("login.showPassword")
                  }
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="mt-1.5 text-right">
                <button
                  type="button"
                  onClick={() => alert(t("login.forgotPasswordAlert"))}
                  className="text-sm text-[#659B35] dark:text-[#85C34A] hover:text-[#207041] dark:hover:text-[#006633] underline underline-offset-2 transition-colors"
                >
                  {t("login.forgotPassword")}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {t("login.loginButton")}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[#CCCCCC] dark:bg-gray-600" />
            <span className="text-sm text-gray-400 dark:text-gray-500">
              {t("login.or")}
            </span>
            <div className="flex-1 h-px bg-[#CCCCCC] dark:bg-gray-600" />
          </div>

          <button
            type="button"
            onClick={() => alert(t("login.biometricsNotAvailable"))}
            className="w-full flex items-center justify-center gap-2 border border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] hover:bg-[#F5F5F5] dark:hover:bg-gray-700 font-semibold py-3 rounded-lg transition-colors"
          >
            <Fingerprint size={20} />
            {t("login.useBiometrics")}
          </button>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
            {t("login.biometricsDescription")}
          </p>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <a
            href="https://www.linkedin.com/company/adif"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-[#659B35] dark:hover:text-[#85C34A] transition-colors"
          >
            <Linkedin size={24} />
          </a>
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="text-gray-400 dark:text-gray-500 hover:text-[#659B35] dark:hover:text-[#85C34A] transition-colors"
            >
              <FlagIcon locale={locale} />
            </button>
            {langOpen && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[130px] z-50">
                {LOCALE_LIST.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocaleSelect(loc)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
                      loc === locale
                        ? "bg-[#E3EB7A]/30 text-[#207041] dark:text-[#85C34A]"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    <FlagIcon locale={loc} />
                    <span>{LOCALE_NAMES[loc]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <a
            href="https://www.adif.es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 dark:text-gray-500 hover:text-[#659B35] dark:hover:text-[#85C34A] transition-colors"
          >
            <Globe size={24} />
          </a>
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
    </div>
  );
}
