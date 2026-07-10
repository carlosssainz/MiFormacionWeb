import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronLeft,
  Search,
  GraduationCap,
  Clock,
  ClipboardCheck,
  Bell,
  PenSquare,
  Eye,
} from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { PanelCard } from "./PanelCard";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { EmptyState } from "./EmptyState";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

const CATEGORIA_LABEL_KEYS = {
  convocatoria: "avisos.announcement",
  horario: "avisos.schedule",
  evaluacion: "avisos.evaluation",
  recordatorio: "avisos.reminder",
};

export function AvisosScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { avisos, markAvisoRead } = useAuth();
  const [tipoFilter, setTipoFilter] = useState("");
  const [estadoFilter, setEstadoFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAvisoId, setSelectedAvisoId] = useState(null);

  const CATEGORIA_CONFIG = {
    convocatoria: {
      icon: GraduationCap,
      color: "#207041",
      bgClass: "bg-[#207041]",
      textClass: "text-green-700 dark:text-green-300",
      borderClass: "border-[#207041]",
      lightBg: "bg-green-100 dark:bg-green-900/40",
      label: t("avisos.announcement"),
    },
    horario: {
      icon: Clock,
      color: "#E67E22",
      bgClass: "bg-[#E67E22]",
      textClass: "text-orange-700 dark:text-orange-300",
      borderClass: "border-[#E67E22]",
      lightBg: "bg-orange-100 dark:bg-orange-900/40",
      label: t("avisos.schedule"),
    },
    evaluacion: {
      icon: ClipboardCheck,
      color: "#2980B9",
      bgClass: "bg-[#2980B9]",
      textClass: "text-blue-700 dark:text-blue-300",
      borderClass: "border-[#2980B9]",
      lightBg: "bg-blue-100 dark:bg-blue-900/40",
      label: t("avisos.evaluation"),
    },
    recordatorio: {
      icon: Bell,
      color: "#D4A017",
      bgClass: "bg-[#D4A017]",
      textClass: "text-yellow-700 dark:text-yellow-300",
      borderClass: "border-[#D4A017]",
      lightBg: "bg-yellow-100 dark:bg-yellow-900/40",
      label: t("avisos.reminder"),
    },
    firma: {
      icon: PenSquare,
      color: "#85C34A",
      bgClass: "bg-[#85C34A]",
      textClass: "text-green-600 dark:text-green-300",
      borderClass: "border-[#85C34A]",
      lightBg: "bg-green-100 dark:bg-green-900/40",
      label: t("avisos.firma"),
    },
  };

  const CATEGORIAS = [
    { value: "", label: t("avisos.typeAll") },
    ...Object.entries(CATEGORIA_CONFIG).map(([key, cfg]) => ({
      value: key,
      label: cfg.label,
    })),
  ];

  const ESTADOS = [
    { value: "Todos", label: t("avisos.statusAll") },
    { value: "Sin leer", label: t("avisos.statusUnread") },
    { value: "Leídos", label: t("avisos.statusRead") },
  ];

  const avisosFiltrados = useMemo(() => {
    let result = [...avisos];

    if (tipoFilter) {
      result = result.filter((a) => a.categoria === tipoFilter);
    }

    if (estadoFilter === "Sin leer") {
      result = result.filter((a) => a.unread);
    } else if (estadoFilter === "Leídos") {
      result = result.filter((a) => !a.unread);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q),
      );
    }

    return result.sort((a, b) => b.id - a.id);
  }, [avisos, tipoFilter, estadoFilter, searchQuery]);

  const handleOpenAviso = (id) => {
    markAvisoRead(id);
    setSelectedAvisoId(id);
  };

  const selectedAviso =
    selectedAvisoId !== null
      ? avisos.find((a) => a.id === selectedAvisoId)
      : null;

  const renderIndicator = (aviso) => {
    if (aviso.count > 0) {
      return (
        <span className="bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[17px] h-[17px] flex items-center justify-center px-0.5 ring-2 ring-white dark:ring-gray-800">
          {aviso.count}
        </span>
      );
    }
    if (aviso.urgent) {
      return (
        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full w-[17px] h-[17px] flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
          !
        </span>
      );
    }
    if (aviso.unread) {
      return (
        <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      );
    }
    return (
      <div className="w-3 h-3 bg-gray-300 dark:bg-gray-500 rounded-full border-2 border-white flex items-center justify-center">
        <Eye size={6} className="text-white" />
      </div>
    );
  };

  return (
    <ScreenLayout headerMode="top" scrollable={false} helpKey="avisos" hideSearch>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="px-4 pt-4 pb-2 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 flex items-center justify-center text-[#659B35] hover:text-[#207041] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-[#207041] dark:text-[#85C34A]">
              {t("avisos.title")}
            </h1>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder={t("avisos.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-[#CCCCCC] dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] transition-shadow"
            />
          </div>
        </div>

        <div className="px-4 pb-2 flex gap-2 flex-shrink-0">
        <div className="relative flex-1">
          <select
            value={tipoFilter}
            onChange={(e) => setTipoFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] border border-[#CCCCCC] dark:border-gray-600 pr-8 transition-shadow"
          >
            {CATEGORIAS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
        </div>
        <div className="relative flex-1">
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] border border-[#CCCCCC] dark:border-gray-600 pr-8 transition-shadow"
          >
            {ESTADOS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll pb-16 px-4 pt-1 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        {avisosFiltrados.length === 0 ? (
          <EmptyState
            icon={<Search size={48} />}
            title={t("avisos.noResults")}
          />
        ) : (
          <div className="space-y-3">
            {avisosFiltrados.map((aviso) => {
              const cfg = CATEGORIA_CONFIG[aviso.categoria];
              const IconComponent = cfg.icon;
              return (
                <PanelCard
                  key={aviso.id}
                  icon={<IconComponent size={20} />}
                  iconColor={cfg.color}
                  title={aviso.title}
                  description={aviso.subtitle}
                  onClick={() => handleOpenAviso(aviso.id)}
                  indicator={renderIndicator(aviso)}
                  badges={
                    <>
                      <span
                        className={`${cfg.lightBg} ${cfg.textClass} px-1.5 py-0.5 rounded text-[10px] font-semibold`}
                      >
                        {cfg.label}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-400">{aviso.time}</span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-400">{aviso.date}</span>
                    </>
                  }
                />
              );
            })}
          </div>
        )}
        </div>
      </div>
      </div>

      <PopupOverlay
        open={!!selectedAviso}
        onClose={() => setSelectedAvisoId(null)}
      >
        {selectedAviso &&
          (() => {
            const cfg = CATEGORIA_CONFIG[selectedAviso.categoria];
            const IconComponent = cfg.icon;
            return (
              <DetailCard
                color={cfg.color}
                icon={<IconComponent size={32} />}
                title={selectedAviso.title}
                subtitle={selectedAviso.subtitle}
                badges={
                  <>
                    <span
                      className={`${cfg.lightBg} ${cfg.textClass} px-2 py-0.5 rounded-full font-semibold`}
                    >
                      {cfg.label}
                    </span>
                    <span>·</span>
                    <span>{selectedAviso.date}</span>
                    <span>·</span>
                    <span>{selectedAviso.time}</span>
                    {selectedAviso.urgent && (
                      <>
                        <span>·</span>
                        <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 px-2 py-0.5 rounded-full font-semibold text-xs">
                          {t("avisos.urgent")}
                        </span>
                      </>
                    )}
                  </>
                }
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-line">
                  {selectedAviso.content}
                </p>
                <div className="border-t border-[#CCCCCC] dark:border-gray-700 pt-4">
                  <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3 uppercase tracking-wide">
                    {t("avisos.details")}
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block">
                        {t("avisos.registrationDeadline")}
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {selectedAviso.plazo}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block">
                        {t("avisos.location")}
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {selectedAviso.ubicacion}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-500 block">
                        {t("avisos.requirements")}
                      </span>
                      <span className="text-sm text-gray-800 dark:text-gray-200">
                        {selectedAviso.requisitos}
                      </span>
                    </div>
                  </div>
                  {selectedAviso.categoria === "evaluacion" && (
                    <button
                      onClick={() => navigate("/encuestas?filtro=pendientes")}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold text-sm transition-colors"
                    >
                      <ClipboardCheck size={16} />
                      {t("avisos.openSurvey")}
                    </button>
                  )}
                </div>
              </DetailCard>
            );
          })()}
      </PopupOverlay>
    </ScreenLayout>
  );
}
