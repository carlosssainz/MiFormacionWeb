import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BookOpen, Calendar, Files, Plus, Monitor, Building2, BookOpen as BookOpenIcon } from "lucide-react";
import { useI18n } from "../context/I18nContext";

const TABS = [
  { path: "/", key: "nav.home", icon: Home },
  { path: "/cursos", key: "nav.courses", icon: BookOpen },
  null,
  { path: "/agenda", key: "nav.agenda", icon: Calendar },
  { path: "/expediente", key: "nav.records", icon: Files },
];

const SOLICITAR_OPTIONS = [
  {
    icon: Monitor,
    title: "Teleformación del mes",
    desc: "Cursos online disponibles este mes",
    path: "/cursos?tab=catalogo",
  },
  {
    icon: Building2,
    title: "Presenciales mi territorio",
    desc: "Cursos presenciales en tu territorio",
    path: "/cursos?tab=catalogo",
  },
  {
    icon: BookOpenIcon,
    title: "Catálogo de cursos",
    desc: "Explora todos los cursos disponibles",
    path: "/cursos?tab=catalogo",
  },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
    }
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  const handleOption = (path) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-[#CCCCCC] dark:border-gray-700 px-4 pb-3 pt-2 z-10 lg:hidden">
        <div className="grid grid-cols-5 gap-2">
          {TABS.map((tab, i) => {
            if (tab === null) {
              return (
                <div key="action-btn" className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setOpen(!open)}
                    data-tutorial="home-bottom-solicitar"
                    className="w-14 h-14 rounded-full bg-[#207041] dark:bg-[#006633] text-white hover:bg-[#185a33] dark:hover:bg-[#004d26] shadow-xl flex items-center justify-center transition-colors -mt-5"
                    aria-label="Solicitar formación"
                  >
                    <Plus size={28} className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
                  </button>
                  <span className={`text-xs whitespace-nowrap transition-colors ${open ? "text-[#207041] dark:text-[#85C34A]" : "text-gray-400 dark:text-gray-500"}`}>
                    Solicitar
                  </span>
                </div>
              );
            }

            const { path, key, icon: Icon } = tab;
            const isActive = location.pathname === path;
            const dataTutorial =
              path === "/" ? "home-bottom-inicio"
              : path === "/cursos" ? "home-bottom-cursos"
              : path === "/agenda" ? "home-bottom-agenda"
              : path === "/expediente" ? "home-bottom-expediente"
              : undefined;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                data-tutorial={dataTutorial}
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center gap-1 py-2 transition-colors ${
                  isActive
                    ? "text-[#207041] dark:text-[#85C34A]"
                    : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                }`}
              >
                <Icon size={24} />
                <span className="text-xs">{t(key)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 bottom-24 z-40 bg-black/5 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-0 right-0 bottom-28 z-50 flex flex-col items-center gap-3 px-6">
            {SOLICITAR_OPTIONS.map((opt, idx) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.title}
                  onClick={() => handleOption(opt.path)}
                  className="w-full max-w-sm flex items-center gap-4 px-5 py-4 rounded-2xl bg-white dark:bg-gray-800 shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-[#659B35]/50 dark:hover:border-[#85C34A]/50 transition-all text-left group animate-fan-in"
                  style={{ animationDelay: `${idx * 80}ms`, animationFillMode: "backwards" }}
                >
                  <div className="w-12 h-12 rounded-xl bg-[#659B35] dark:bg-[#85C34A] flex items-center justify-center shrink-0 group-hover:bg-[#207041] dark:group-hover:bg-[#006633] transition-colors">
                    <Icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {opt.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        @keyframes fan-in {
          from {
            opacity: 0;
            transform: translateY(16px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fan-in {
          animation: fan-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
