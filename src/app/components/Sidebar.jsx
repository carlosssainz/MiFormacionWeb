import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

const SECTION_ICONS = {
  mainMenu: <Home size={14} />,
  trainingServices: <Wrench size={14} />,
  myRecords: <User size={14} />,
  myPlan: <Calendar size={14} />,
  myEvaluations: <FileCheck size={14} />,
  myMobility: <Briefcase size={14} />,
  support: <HelpCircle size={14} />,
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
    icon: <Home size={20} />,
    labelKey: "sidebar.home",
    descKey: "sidebar.homeDesc",
    sectionKey: "mainMenu",
    screen: "/",
  },
  {
    icon: <BookOpen size={20} />,
    labelKey: "sidebar.courses",
    descKey: "sidebar.coursesDesc",
    sectionKey: "mainMenu",
    screen: "/cursos",
  },
  {
    icon: <Bell size={20} />,
    labelKey: "sidebar.notices",
    descKey: "sidebar.noticesDesc",
    sectionKey: "mainMenu",
    screen: "/avisos",
  },
  {
    icon: <ClipboardList size={20} />,
    labelKey: "sidebar.acciones",
    descKey: "sidebar.accionesDesc",
    sectionKey: "mainMenu",
    screen: "/acciones",
  },
  {
    icon: <FileText size={20} />,
    labelKey: "sidebar.news",
    descKey: "sidebar.newsDesc",
    sectionKey: "mainMenu",
    screen: "/noticias",
  },
  {
    icon: <Calendar size={20} />,
    labelKey: "sidebar.agenda",
    descKey: "sidebar.agendaDesc",
    sectionKey: "mainMenu",
    screen: "/agenda",
  },

  {
    icon: <Globe size={20} />,
    labelKey: "sidebar.portals",
    descKey: "sidebar.portalsDesc",
    sectionKey: "trainingServices",
    screen: "/mis-portales",
  },
  {
    icon: <Tv size={20} />,
    labelKey: "sidebar.trainingTV",
    descKey: "sidebar.trainingTVDesc",
    sectionKey: "trainingServices",
    screen: "/canales",
  },
  {
    icon: <Pill size={20} />,
    labelKey: "sidebar.pills",
    descKey: "sidebar.pillsDesc",
    sectionKey: "trainingServices",
    screen: "/pildoras",
  },
  {
    icon: <Search size={20} />,
    labelKey: "sidebar.catalog",
    descKey: "sidebar.catalogDesc",
    sectionKey: "trainingServices",
    screen: "/cursos?tab=catalogo",
  },
  {
    icon: <Calendar size={20} />,
    labelKey: "sidebar.upcomingCourses",
    descKey: "sidebar.upcomingCoursesDesc",
    sectionKey: "trainingServices",
    screen: "/cursos?tab=proximos",
  },
  {
    icon: <FileText size={20} />,
    labelKey: "sidebar.docs",
    descKey: "sidebar.docsDesc",
    sectionKey: "trainingServices",
    screen: "/docs",
  },
  {
    icon: <LinkIcon size={20} />,
    labelKey: "sidebar.links",
    descKey: "sidebar.linksDesc",
    sectionKey: "trainingServices",
    screen: "/links",
  },
  {
    icon: <Wrench size={20} />,
    labelKey: "sidebar.allTools",
    descKey: "sidebar.allToolsDesc",
    sectionKey: "trainingServices",
    screen: "/servicios",
  },

  {
    icon: <User size={20} />,
    labelKey: "sidebar.profile",
    descKey: "sidebar.profileDesc",
    sectionKey: "myRecords",
    screen: "/profile",
  },
  {
    icon: <BookOpen size={20} />,
    labelKey: "sidebar.attendedCourses",
    descKey: "sidebar.attendedCoursesDesc",
    sectionKey: "myRecords",
    screen: "/cursos?tab=mis-cursos",
  },
  {
    icon: <UserCheck size={20} />,
    labelKey: "sidebar.employeeHabilitation",
    descKey: "sidebar.employeeHabilitationDesc",
    sectionKey: "myRecords",
    screen: "/habilitaciones",
  },
  {
    icon: <Shield size={20} />,
    labelKey: "sidebar.safetyHabilitation",
    descKey: "sidebar.safetyHabilitationDesc",
    sectionKey: "myRecords",
    screen: "/habilitaciones",
  },
  {
    icon: <Award size={20} />,
    labelKey: "sidebar.degrees",
    descKey: "sidebar.degreesDesc",
    sectionKey: "myRecords",
    screen: "/programas",
  },
  {
    icon: <Globe size={20} />,
    labelKey: "sidebar.languages",
    descKey: "sidebar.languagesDesc",
    sectionKey: "myRecords",
    screen: null,
  },
  {
    icon: <FileCheck size={20} />,
    labelKey: "sidebar.programs",
    descKey: "sidebar.programsDesc",
    sectionKey: "myRecords",
    screen: "/programas",
  },
  {
    icon: <Calendar size={20} />,
    labelKey: "sidebar.events",
    descKey: "sidebar.eventsDesc",
    sectionKey: "myRecords",
    screen: "/eventos-jornadas",
  },

  {
    icon: <Calendar size={20} />,
    labelKey: "sidebar.currentYear",
    descKey: "sidebar.currentYearDesc",
    sectionKey: "myPlan",
    screen: "/captura-necesidades",
  },
  {
    icon: <Clock size={20} />,
    labelKey: "sidebar.nextYear",
    descKey: "sidebar.nextYearDesc",
    sectionKey: "myPlan",
    screen: "/captura-necesidades",
  },
  {
    icon: <FileText size={20} />,
    labelKey: "sidebar.request",
    descKey: "sidebar.requestDesc",
    sectionKey: "myPlan",
    screen: "/captura-necesidades",
  },

  {
    icon: <ClipboardCheck size={20} />,
    labelKey: "sidebar.pending",
    descKey: "sidebar.pendingDesc",
    sectionKey: "myEvaluations",
    screen: "/encuestas?filtro=pendientes",
  },
  {
    icon: <FileCheck size={20} />,
    labelKey: "sidebar.completed",
    descKey: "sidebar.completedDesc",
    sectionKey: "myEvaluations",
    screen: "/encuestas?filtro=realizadas",
  },
  {
    icon: <MessageSquare size={20} />,
    labelKey: "sidebar.suggestions",
    descKey: "sidebar.suggestionsDesc",
    sectionKey: "myEvaluations",
    screen: "/sugerencias",
  },

  {
    icon: <FileText size={20} />,
    labelKey: "sidebar.mobilityRequests",
    descKey: "sidebar.mobilityRequestsDesc",
    sectionKey: "myMobility",
    screen: "/movilidad-solicitudes",
  },
  {
    icon: <ClipboardList size={20} />,
    labelKey: "sidebar.examsUpcoming",
    descKey: "sidebar.examsUpcomingDesc",
    sectionKey: "myMobility",
    screen: "/examenes-previstos",
  },
  {
    icon: <FileText size={20} />,
    labelKey: "sidebar.examsInProgress",
    descKey: "sidebar.examsInProgressDesc",
    sectionKey: "myMobility",
    screen: "/examenes-proceso",
  },
  {
    icon: <FileCheck size={20} />,
    labelKey: "sidebar.examsCompleted",
    descKey: "sidebar.examsCompletedDesc",
    sectionKey: "myMobility",
    screen: "/examenes-realizados",
  },
  {
    icon: <BookOpen size={20} />,
    labelKey: "sidebar.syllabus",
    descKey: "sidebar.syllabusDesc",
    sectionKey: "myMobility",
    screen: "/temarios",
  },

  {
    icon: <Camera size={20} />,
    labelKey: "sidebar.qrScanner",
    descKey: "sidebar.qrScannerDesc",
    sectionKey: "mainMenu",
    screen: "/qr-scanner",
  },
  {
    icon: <Settings size={20} />,
    labelKey: "sidebar.settings",
    descKey: "sidebar.settingsDesc",
    sectionKey: "support",
    screen: "/settings",
  },
];

export function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

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
      label: t(item.labelKey),
      description: t(item.descKey),
      sectionTitle: t(SECTION_KEY_MAP[item.sectionKey]),
    }));
  }, [t]);

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

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />
      )}

      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-[#CCCCCC] dark:border-gray-700">
          <span className="text-sm font-bold text-[#207041] dark:text-[#85C34A]">
            {t("sidebar.menu")}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder={t("sidebar.search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A]"
            />

            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-scroll py-2 scroll-container">
          <div className="min-h-[calc(100%+1px)]">
          {groupedItems.map(({ sectionKey, sectionTitle, items }) => (
            <div key={sectionKey}>
              <div className="flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {SECTION_ICONS[sectionKey]}
                <span>{sectionTitle}</span>
              </div>
              {items.map((item, idx) => (
                <button
                  key={`${sectionKey}-${idx}`}
                  onClick={() => handleItemClick(item)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="flex-shrink-0 text-gray-600 dark:text-gray-300">
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-gray-400 dark:text-gray-500 truncate leading-tight">
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
              <div className="mx-4 my-1 h-px bg-gray-100 dark:bg-gray-700" />
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
      </div>
    </>
  );
}
