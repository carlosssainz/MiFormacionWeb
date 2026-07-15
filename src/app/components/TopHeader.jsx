import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Menu, Bell, ClipboardList } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import adifLogo from "../imports/logoLight.png";
import perfilImg from "../imports/foto (7).jpg";

const SEARCH_HINTS = [
  "Descubrir formación...",
  "Buscar cursos...",
  "Buscar documentos...",
  "Buscar píldoras...",
  "Buscar noticias...",
  "Buscar exámenes...",
  "Buscar temarios...",
  "Buscar programas...",
  "Buscar eventos...",
];

const ROUTE_TO_HINT = {
  "/": 0,
  "/cursos": 1,
  "/curso": 1,
  "/noticias": 4,
  "/examenes-previstos": 5,
  "/examenes-proceso": 5,
  "/examenes-realizados": 5,
  "/temarios": 6,
  "/programas": 7,
  "/eventos-jornadas": 8,
  "/agenda": 8,
  "/pildoras": 3,
  "/docs": 2,
  "/expediente": 2,
};

function getHintIndexForPath(pathname) {
  for (const [route, index] of Object.entries(ROUTE_TO_HINT)) {
    if (pathname.startsWith(route)) return index;
  }
  return 0;
}

export function TopHeader({ title, onHelpClick }) {
  const location = useLocation();
  const { toggleMenu, unreadCount, pendingAccionesCount, setGlobalSearchOpen } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [shake, setShake] = useState(false);
  const [hintIndex, setHintIndex] = useState(() =>
    getHintIndexForPath(location.pathname),
  );
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const bellInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 80000);
    return () => clearInterval(bellInterval);
  }, []);

  useEffect(() => {
    setHintIndex(getHintIndexForPath(location.pathname));
  }, [location.pathname]);

  useEffect(() => {
    const hintInterval = setInterval(() => {
      setHintIndex((i) => (i + 1) % SEARCH_HINTS.length);
      setAnimKey((k) => k + 1);
    }, 3500);
    return () => clearInterval(hintInterval);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between shadow-sm lg:hidden">
      <div className="flex items-center gap-2" data-tutorial="home-top-left">
        <button
          onClick={toggleMenu}
          data-tutorial="home-top-menu"
          className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 transition-colors lg:hidden"
          aria-label={t("header.openMenu")}
        >
          <Menu size={20} />
        </button>
        <button onClick={() => navigate("/")} className="cursor-pointer">
          <img
            src={adifLogo}
            alt="ADIF"
            className="h-7 dark:brightness-0 dark:invert"
          />
        </button>
      </div>

      {title ? (
        <div className="flex items-center gap-2 flex-1 justify-center">
          <h1 className="text-lg font-bold text-[#207041] dark:text-[#85C34A] truncate">
            {title}
          </h1>
          {onHelpClick && (
            <button
              onClick={onHelpClick}
              className="w-6 h-6 rounded-full border border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] hover:bg-[#659B35] hover:text-white dark:hover:bg-[#85C34A] dark:hover:text-gray-900 flex items-center justify-center transition-colors shrink-0 text-[10px] font-bold"
            >
              ?
            </button>
          )}
        </div>
      ) : (
        <div className="flex-1 flex items-center">
          <div className="hidden lg:flex flex-1 max-w-md mx-auto">
            <button
              onClick={() => setGlobalSearchOpen(true)}
              className="flex-1 flex items-center gap-2 h-8 px-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left overflow-hidden"
            >
              <Search size={14} className="shrink-0 text-gray-400" />
              <span key={animKey} className="text-xs animate-fade-in">
                {SEARCH_HINTS[hintIndex]}
              </span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => navigate("/acciones")}
          data-tutorial="home-top-acciones"
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="Acciones pendientes"
        >
          <div className="relative">
            <ClipboardList size={20} />
            {pendingAccionesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                {pendingAccionesCount > 9 ? "9+" : pendingAccionesCount}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => navigate("/avisos")}
          data-tutorial="home-top-avisos"
          className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label={t("header.notifications")}
        >
          <div className="relative">
            <Bell size={20} className={shake ? "animate-bell-shake" : ""} />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </button>
        <div data-tutorial="home-top-perfil">
          <button
            onClick={() => navigate("/profile")}
            className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 border-[#659B35] hover:border-[#207041] transition-colors"
          >
            <img
              src={perfilImg}
              alt={t("header.profile")}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
