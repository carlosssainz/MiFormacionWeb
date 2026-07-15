import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  X,
  Home,
  BookOpen,
  Bell,
  FileText,
  Calendar,
  Wrench,
  Pill,
  User,
  UserCheck,
  Shield,
  Award,
  Globe,
  ClipboardList,
  ClipboardCheck,
  FileCheck,
  Camera,
  Settings,
  HelpCircle,
  Briefcase,
  Link as LinkIcon,
  Tv,
  MessageSquare,
  Clock,
  LogOut,
  Building2,
  Files,
  Monitor,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { useTutorial } from "../context/TutorialContext";
import perfilImg from "../imports/foto (7).jpg";
import adifLogo from "../imports/logoLight.png";

const SECTION_ICONS = {
  mainMenu: <Home size={16} />,
  trainingServices: <Wrench size={16} />,
  myRecords: <User size={16} />,
  myPlan: <Calendar size={16} />,
  myEvaluations: <FileCheck size={16} />,
  myMobility: <Briefcase size={16} />,
  support: <HelpCircle size={16} />,
};

const SECTION_KEY_MAP = {
  mainMenu: "section.mainMenu",
  trainingServices: "section.trainingServices",
  myRecords: "section.myRecords",
  myPlan: "section.myPlan",
  myEvaluations: "section.myEvaluations",
  myMobility: "section.myMobility",
  support: "section.support",
};

const ALL_ITEMS = [
  {
    icon: <Home size={24} />,
    labelKey: "sidebar.home",
    descKey: "sidebar.homeDesc",
    sectionKey: "mainMenu",
    screen: "/",
  },
  {
    icon: <BookOpen size={24} />,
    labelKey: "sidebar.courses",
    descKey: "sidebar.coursesDesc",
    sectionKey: "mainMenu",
    screen: "/cursos",
  },
  {
    icon: <Bell size={24} />,
    labelKey: "sidebar.notices",
    descKey: "sidebar.noticesDesc",
    sectionKey: "mainMenu",
    screen: "/avisos",
  },
  {
    icon: <ClipboardList size={24} />,
    labelKey: "sidebar.acciones",
    descKey: "sidebar.accionesDesc",
    sectionKey: "mainMenu",
    screen: "/acciones",
  },
  {
    icon: <FileText size={24} />,
    labelKey: "sidebar.news",
    descKey: "sidebar.newsDesc",
    sectionKey: "mainMenu",
    screen: "/noticias",
  },
  {
    icon: <Calendar size={24} />,
    labelKey: "sidebar.agenda",
    descKey: "sidebar.agendaDesc",
    sectionKey: "mainMenu",
    screen: "/agenda",
  },

  {
    icon: <Globe size={24} />,
    labelKey: "sidebar.portals",
    descKey: "sidebar.portalsDesc",
    sectionKey: "trainingServices",
    screen: "/mis-portales",
  },
  {
    icon: <Tv size={24} />,
    labelKey: "sidebar.trainingTV",
    descKey: "sidebar.trainingTVDesc",
    sectionKey: "trainingServices",
    screen: "/canales",
  },
  {
    icon: <Pill size={24} />,
    labelKey: "sidebar.pills",
    descKey: "sidebar.pillsDesc",
    sectionKey: "trainingServices",
    screen: "/pildoras",
  },
  {
    icon: <Search size={24} />,
    labelKey: "sidebar.catalog",
    descKey: "sidebar.catalogDesc",
    sectionKey: "trainingServices",
    screen: "/cursos?tab=catalogo",
  },
  {
    icon: <Calendar size={24} />,
    labelKey: "sidebar.upcomingCourses",
    descKey: "sidebar.upcomingCoursesDesc",
    sectionKey: "trainingServices",
    screen: "/cursos?tab=proximos",
  },
  {
    icon: <FileText size={24} />,
    labelKey: "sidebar.docs",
    descKey: "sidebar.docsDesc",
    sectionKey: "trainingServices",
    screen: "/docs",
  },
  {
    icon: <LinkIcon size={24} />,
    labelKey: "sidebar.links",
    descKey: "sidebar.linksDesc",
    sectionKey: "trainingServices",
    screen: "/links",
  },
  {
    icon: <Wrench size={24} />,
    labelKey: "sidebar.allTools",
    descKey: "sidebar.allToolsDesc",
    sectionKey: "trainingServices",
    screen: "/servicios",
  },

  {
    icon: <User size={24} />,
    labelKey: "sidebar.profile",
    descKey: "sidebar.profileDesc",
    sectionKey: "myRecords",
    screen: "/profile",
  },
  {
    icon: <BookOpen size={24} />,
    labelKey: "sidebar.attendedCourses",
    descKey: "sidebar.attendedCoursesDesc",
    sectionKey: "myRecords",
    screen: "/cursos?tab=mis-cursos",
  },
  {
    icon: <UserCheck size={24} />,
    labelKey: "sidebar.employeeHabilitation",
    descKey: "sidebar.employeeHabilitationDesc",
    sectionKey: "myRecords",
    screen: "/habilitaciones",
  },
  {
    icon: <Shield size={24} />,
    labelKey: "sidebar.safetyHabilitation",
    descKey: "sidebar.safetyHabilitationDesc",
    sectionKey: "myRecords",
    screen: "/habilitaciones",
  },
  {
    icon: <Award size={24} />,
    labelKey: "sidebar.degrees",
    descKey: "sidebar.degreesDesc",
    sectionKey: "myRecords",
    screen: "/programas",
  },
  {
    icon: <Globe size={24} />,
    labelKey: "sidebar.languages",
    descKey: "sidebar.languagesDesc",
    sectionKey: "myRecords",
    screen: null,
  },
  {
    icon: <FileCheck size={24} />,
    labelKey: "sidebar.programs",
    descKey: "sidebar.programsDesc",
    sectionKey: "myRecords",
    screen: "/programas",
  },
  {
    icon: <Calendar size={24} />,
    labelKey: "sidebar.events",
    descKey: "sidebar.eventsDesc",
    sectionKey: "myRecords",
    screen: "/eventos-jornadas",
  },

  {
    icon: <Calendar size={24} />,
    labelKey: "sidebar.currentYear",
    descKey: "sidebar.currentYearDesc",
    sectionKey: "myPlan",
    screen: "/captura-necesidades",
  },
  {
    icon: <Clock size={24} />,
    labelKey: "sidebar.nextYear",
    descKey: "sidebar.nextYearDesc",
    sectionKey: "myPlan",
    screen: "/captura-necesidades",
  },
  {
    icon: <FileText size={24} />,
    labelKey: "sidebar.request",
    descKey: "sidebar.requestDesc",
    sectionKey: "myPlan",
    screen: "/captura-necesidades",
  },

  {
    icon: <ClipboardCheck size={24} />,
    labelKey: "sidebar.pending",
    descKey: "sidebar.pendingDesc",
    sectionKey: "myEvaluations",
    screen: "/encuestas?filtro=pendientes",
  },
  {
    icon: <FileCheck size={24} />,
    labelKey: "sidebar.completed",
    descKey: "sidebar.completedDesc",
    sectionKey: "myEvaluations",
    screen: "/encuestas?filtro=realizadas",
  },
  {
    icon: <MessageSquare size={24} />,
    labelKey: "sidebar.suggestions",
    descKey: "sidebar.suggestionsDesc",
    sectionKey: "myEvaluations",
    screen: "/sugerencias",
  },

  {
    icon: <FileText size={24} />,
    labelKey: "sidebar.mobilityRequests",
    descKey: "sidebar.mobilityRequestsDesc",
    sectionKey: "myMobility",
    screen: "/movilidad-solicitudes",
  },
  {
    icon: <ClipboardList size={24} />,
    labelKey: "sidebar.examsUpcoming",
    descKey: "sidebar.examsUpcomingDesc",
    sectionKey: "myMobility",
    screen: "/examenes-previstos",
  },
  {
    icon: <FileText size={24} />,
    labelKey: "sidebar.examsInProgress",
    descKey: "sidebar.examsInProgressDesc",
    sectionKey: "myMobility",
    screen: "/examenes-proceso",
  },
  {
    icon: <FileCheck size={24} />,
    labelKey: "sidebar.examsCompleted",
    descKey: "sidebar.examsCompletedDesc",
    sectionKey: "myMobility",
    screen: "/examenes-realizados",
  },
  {
    icon: <BookOpen size={24} />,
    labelKey: "sidebar.syllabus",
    descKey: "sidebar.syllabusDesc",
    sectionKey: "myMobility",
    screen: "/temarios",
  },

  {
    icon: <Camera size={24} />,
    labelKey: "sidebar.qrScanner",
    descKey: "sidebar.qrScannerDesc",
    sectionKey: "mainMenu",
    screen: "/qr-scanner",
  },
  {
    icon: <Settings size={24} />,
    labelKey: "sidebar.settings",
    descKey: "sidebar.settingsDesc",
    sectionKey: "support",
    screen: "/settings",
  },
  {
    icon: <Award size={24} />,
    labelKey: "sidebar.tutorials",
    descKey: "sidebar.tutorialsDesc",
    sectionKey: "support",
    screen: "/settings",
    isTutorial: true,
  },
];

export function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, username, unreadCount, pendingAccionesCount } = useAuth();
  const { t } = useI18n();
  const { completedCount, totalTutorials } = useTutorial();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const [solicitarOpen, setSolicitarOpen] = useState(false);
  const solicitarRef = useRef(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    function handleClick(e) {
      if (solicitarOpen && solicitarRef.current && !solicitarRef.current.contains(e.target)) {
        setSolicitarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [solicitarOpen]);

  useEffect(() => {
    const bellInterval = setInterval(() => {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }, 80000);
    return () => clearInterval(bellInterval);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setQuery("");
    }
  }, [open]);

  const translatedItems = useMemo(() => {
    return ALL_ITEMS.map((item) => ({
      ...item,
      label: item.isTutorial ? "🎮 Tutoriales" : t(item.labelKey),
      description: item.isTutorial ? `${completedCount}/${totalTutorials} completados` : t(item.descKey),
      sectionTitle: t(SECTION_KEY_MAP[item.sectionKey]),
    }));
  }, [t, completedCount, totalTutorials]);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return translatedItems;
    const q = query.toLowerCase().trim();
    return translatedItems.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [query, translatedItems]);

  const groupedItems = useMemo(() => {
    const map = new Map();
    for (const item of filteredItems) {
      const key = item.sectionKey;
      if (!map.has(key)) {
        map.set(key, {
          sectionKey: key,
          sectionTitle: item.sectionTitle,
          items: [],
        });
      }
      map.get(key).items.push(item);
    }
    return Array.from(map.values());
  }, [filteredItems]);

  const handleItemClick = useCallback(
    (item) => {
      if (item.screen) {
        let path = item.screen;
        if (path === "/qr-scanner" && role === "formador") {
          path = "/qr-generator";
        }
        navigate(path);
        onClose();
      } else {
        alert(`"${item.label}" ${t("sidebar.comingSoon")}`);
      }
    },
    [navigate, onClose, role, t],
  );

  const isItemActive = useCallback(
    (item) => {
      if (!item.screen) return false;
      const itemPath = item.screen.split("?")[0];
      return location.pathname === itemPath;
    },
    [location.pathname],
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[280px] lg:w-[380px] bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:shadow-2xl`}
      >
        <div className="flex items-center justify-between h-16 px-4 lg:px-6 border-b border-[#CCCCCC] dark:border-gray-700 shrink-0">
          <button onClick={() => navigate("/")} className="cursor-pointer">
            <img
              src={adifLogo}
              alt="ADIF"
              className="h-8 dark:brightness-0 dark:invert"
            />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 lg:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-4 lg:px-6 lg:py-5 lg:border-b lg:border-gray-100 dark:lg:border-gray-700/50 lg:bg-gray-50 dark:lg:bg-gray-700/20 shrink-0">
          <button
            onClick={() => navigate("/profile")}
            className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#659B35] hover:border-[#207041] transition-colors shrink-0"
          >
            <img src={perfilImg} alt={t("header.profile")} className="w-full h-full object-cover" />
          </button>
          <div className="flex-1 min-w-0">
            <button
              onClick={() => navigate("/profile")}
              className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate hover:text-[#207041] dark:hover:text-[#85C34A] transition-colors text-left w-full"
            >
              {username || "Usuario"}
            </button>
            <div className="text-xs text-gray-400 capitalize">
              {role === "formador" ? "Formador" : "Alumno"}
            </div>
          </div>
          <button
            onClick={() => navigate("/acciones")}
            className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shrink-0"
            aria-label="Acciones pendientes"
          >
            <div className="relative">
              <ClipboardList size={22} />
              {pendingAccionesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[10px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                  {pendingAccionesCount > 9 ? "9+" : pendingAccionesCount}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => navigate("/avisos")}
            className="w-11 h-11 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shrink-0"
            aria-label={t("header.notifications")}
          >
            <div className="relative">
              <Bell size={22} className={shake ? "animate-bell-shake" : ""} />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[14px] h-3.5 flex items-center justify-center px-0.5">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </div>
          </button>
        </div>

        <div className="px-3 lg:px-6 pt-4 pb-3 shrink-0">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder={t("sidebar.search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-base text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A]"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="hidden lg:block px-6 pb-5">
          <div className="grid grid-cols-5">
            {[
              { path: "/", icon: Home, labelKey: "nav.home" },
              { path: "/cursos", icon: BookOpen, labelKey: "nav.courses" },
              null,
              { path: "/agenda", icon: Calendar, labelKey: "nav.agenda" },
              { path: "/expediente", icon: Files, labelKey: "nav.records" },
            ].map((item, i) => {
              if (item === null) {
                return (
                  <div key="solicitar" className="relative" ref={solicitarRef}>
                    <button
                      onClick={() => setSolicitarOpen(!solicitarOpen)}
                      className={`flex flex-col items-center gap-1 py-2.5 rounded-lg transition-colors ${
                        solicitarOpen
                          ? "text-[#207041] dark:text-[#85C34A] bg-[#659B35]/10 dark:bg-[#85C34A]/10"
                          : "text-gray-500 dark:text-gray-400 hover:text-[#207041] dark:hover:text-[#85C34A] hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Plus size={22} className={`transition-transform ${solicitarOpen ? "rotate-45" : ""}`} />
                      <span className="text-xs leading-tight">Solicitar</span>
                    </button>
                    {solicitarOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                        {[
                          { icon: Monitor, title: "Teleformación del mes", desc: "Cursos online disponibles este mes", path: "/cursos?tab=catalogo" },
                          { icon: Building2, title: "Presenciales mi territorio", desc: "Cursos presenciales en tu territorio", path: "/cursos?tab=catalogo" },
                          { icon: BookOpen, title: "Catálogo de cursos", desc: "Explora todos los cursos disponibles", path: "/cursos?tab=catalogo" },
                        ].map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.title}
                              onClick={() => { navigate(opt.path); setSolicitarOpen(false); onClose(); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                              <div className="w-9 h-9 rounded-md bg-[#659B35] dark:bg-[#85C34A] flex items-center justify-center shrink-0">
                                <Icon size={18} className="text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{opt.title}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{opt.desc}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }
              const { path, icon: Icon, labelKey } = item;
              const isActive = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => { navigate(path); onClose(); }}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? "text-[#207041] dark:text-[#85C34A] bg-[#659B35]/10 dark:bg-[#85C34A]/10"
                      : "text-gray-500 dark:text-gray-400 hover:text-[#207041] dark:hover:text-[#85C34A] hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon size={22} />
                  <span className="text-xs leading-tight truncate max-w-full">{t(labelKey)}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-2 mx-1 h-px bg-gray-100 dark:bg-gray-700/50" />
        </div>

        <div className="flex-1 overflow-y-scroll py-1 scroll-container">
          <div className="min-h-[calc(100%+1px)]">
          {groupedItems.map(({ sectionKey, sectionTitle, items }, groupIdx) => (
            <div key={sectionKey}>
              <div className={`flex items-center gap-3 px-4 lg:px-6 py-3.5 text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-700/30 ${groupIdx > 0 ? "border-t border-gray-100 dark:border-gray-700/50" : ""}`}>
                <span className="text-[#659B35] dark:text-[#85C34A]">{SECTION_ICONS[sectionKey]}</span>
                <span>{sectionTitle}</span>
              </div>
              {items.map((item, idx) => {
                const active = isItemActive(item);
                return (
                  <button
                    key={`${sectionKey}-${idx}`}
                    onClick={() => handleItemClick(item)}
                    className={`w-full flex items-center gap-4 px-4 lg:px-6 py-2.5 lg:py-4 text-left transition-colors ${
                      active
                        ? "bg-[#659B35]/10 dark:bg-[#85C34A]/10 text-[#207041] dark:text-[#85C34A] border-l-2 border-[#659B35] dark:border-[#85C34A]"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-l-2 border-transparent"
                    }`}
                  >
                    <span className={`flex-shrink-0 ${active ? "text-[#207041] dark:text-[#85C34A]" : "text-gray-500 dark:text-gray-400"}`}>
                      {item.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${active ? "font-semibold" : ""}`}>
                        {item.label}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 truncate leading-tight hidden lg:block">
                        {item.description}
                      </div>
                    </div>
                  </button>
                );
              })}
              {groupIdx < groupedItems.length - 1 && (
                <div className="mx-4 lg:mx-6 my-1.5 h-px bg-gray-100 dark:bg-gray-700/50 hidden lg:block" />
              )}
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 px-4 text-center">
              <Search size={36} className="mb-2 opacity-50" />
              <p className="text-sm">{t("sidebar.noResults")}</p>
              <p className="text-xs mt-1">{t("sidebar.tryOtherTerms")}</p>
            </div>
          )}
          </div>
        </div>

        <div className="hidden lg:flex lg:items-center lg:gap-3 lg:px-6 lg:py-4 lg:border-t lg:border-gray-100 dark:lg:border-gray-700/50 lg:bg-gray-50 dark:lg:bg-gray-700/20 shrink-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <LogOut size={18} className="text-gray-400" />
          <span className="text-sm text-gray-500 font-medium">Cerrar sesión</span>
        </div>
      </div>
    </>
  );
}
