import { useState, useMemo, useEffect } from "react";
import { useI18n } from "../context/I18nContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  BookOpen,
  HardHat,
  Monitor,
  Wrench,
  Radio,
  X,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  ArrowUpDown,
  MapPin,
  Calendar,
  Users,
  FileText,
} from "lucide-react";
import { CURSOS_DATA, CONVOCATORIAS } from "../data/mockData";
import { ScreenLayout } from "./ScreenLayout";
import { ContextualHelp } from "./ContextualHelp";
import { TutorialOverlay } from "./TutorialOverlay";
import { TUTORIALS } from "../data/tutorialContent";

function DonutChart({ progress, size = 34 }) {
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />

      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy="0.35em"
        fill="white"
        fontSize="10"
        fontWeight="bold"
      >
        {progress}%
      </text>
    </svg>
  );
}

function CourseIcon({ icon }) {
  const icons = {
    helmet: <HardHat size={22} />,
    screen: <Monitor size={22} />,
    tools: <Wrench size={22} />,
    signal: <Radio size={22} />,
  };
  return <>{icons[icon] ?? <BookOpen size={22} />}</>;
}

const SOLICITUD_PRIORITY = {
  completado: 0,
  aceptado: 1,
  pendiente: 2,
  rechazado: 3,
};

function StatusBadge({ status, t }) {
  const config = {
    aceptado: { dot: "bg-green-400", label: t("courses.accepted") },
    pendiente: { dot: "bg-amber-400", label: t("courses.pending") },
    rechazado: { dot: "bg-red-400", label: t("courses.rejected") },
    completado: { dot: "bg-blue-400", label: t("courses.completed") },
  };
  const c = config[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-white/80">
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function ConvocatoriaSelectorModal({ convocatorias, onSelect, onClose, t }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {t("courses.selectConvocatoria")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto">
          {convocatorias.map((conv) => {
            const selected = selectedId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                  selected
                    ? "border-[#659B35] bg-[#659B35]/5"
                    : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <div className="font-semibold text-sm text-gray-800 dark:text-gray-100 mb-2">
                  {conv.titulo}
                </div>
                <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={12} />
                    <span>
                      {conv.fechaInicio} — {conv.fechaFin}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    <span>{conv.ubicacion}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={12} />
                    <span>{conv.modalidad}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users size={12} />
                    <span>
                      {conv.plazasDisponibles}/{conv.plazas}{" "}
                      {t("courses.plazas")} {t("courses.available")}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {t("courses.cancel")}
          </button>
          <button
            disabled={selectedId === null}
            onClick={() => {
              const conv = convocatorias.find((c) => c.id === selectedId);
              if (conv) onSelect(conv);
            }}
            className={`flex-1 py-2.5 font-semibold text-sm rounded-xl transition-colors ${
              selectedId !== null
                ? "bg-[#659B35] dark:bg-[#85C34A] text-white hover:bg-[#207041] dark:hover:bg-[#006633]"
                : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {t("courses.request")}
          </button>
        </div>
      </div>
    </div>
  );
}

function NecesidadModal({ cursoTitle, cursoMateria, onSave, onClose, t }) {
  const [materia, setMateria] = useState(cursoMateria);
  const [description, setDescription] = useState("");

  const handleSave = () => {
    if (!description.trim()) return;
    onSave({ materia, description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            {t("courses.needsModalTitle")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            {t("courses.needsMateria")}
          </label>
          <select
            value={materia}
            onChange={(e) => setMateria(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#F5F5F5] dark:bg-gray-700 border border-[#CCCCCC] dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A]"
          >
            {[
              "Seguridad",
              "Electrificación",
              "Igualdad",
              "Innovación y Tecnología",
              "Operaciones",
              "Gestión",
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            {t("courseDetail.title")}
          </label>
          <div className="px-3 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200">
            {cursoTitle}
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
            {t("courses.needsDescription")}
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("courses.needsDescription")}
            rows={4}
            className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#E3EB7A]"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {t("cancel")}
          </button>
          <button
            disabled={!description.trim()}
            onClick={handleSave}
            className={`flex-1 py-2.5 font-semibold text-sm rounded-xl transition-colors ${
              description.trim()
                ? "bg-[#659B35] dark:bg-[#85C34A] text-white hover:bg-[#207041] dark:hover:bg-[#006633]"
                : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {t("courses.needsSubmit")}
          </button>
        </div>
      </div>
    </div>
  );
}

export function CursosScreen() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "mis-cursos";
  const filtroParam = searchParams.get("filtro");

  const getInitialStatusFilters = () => {
    if (filtroParam === "todos") return { inProgress: false, completed: true };
    if (filtroParam === "realizados")
      return { inProgress: false, completed: true };
    return { inProgress: true, completed: false };
  };

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activePills, setActivePills] = useState([t("courses.all")]);
  const [statusFilters, setStatusFilters] = useState(getInitialStatusFilters);
  const [filterMateria, setFilterMateria] = useState("");
  const [filterCenter, setFilterCenter] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterType, setFilterType] = useState("");
  const [solicitudes, setSolicitudes] = useState({
    4: "aceptado",
    5: "pendiente",
    9: "rechazado",
  });
  const [solicitandoId, setSolicitandoId] = useState(null);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] =
    useState(null);
  const [mostrarSelectorConvocatoria, setMostrarSelectorConvocatoria] =
    useState(null);
  const [tipoSolicitud, setTipoSolicitud] = useState(null);
  const [helpVisible, setHelpVisible] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [showSort, setShowSort] = useState(false);
  const [necesidadCurso, setNecesidadCurso] = useState(null);
  const [necesidadSuccess, setNecesidadSuccess] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "proximos" && sortField !== "requested") {
      setSortField("requested");
    }
  }, [activeTab]);

  const ALL_TAGS = [
    t("courses.all"),
    t("courses.cfv"),
    t("courses.virtual"),
    t("courses.inPerson"),
    t("courses.teaching"),
  ];

  const FILTER_MATERIAS = [
    { value: "", label: t("courses.all") },
    {
      value: "Electrificación",
      label: t("courses.filterSubjectElectrificacion"),
    },
    { value: "Igualdad", label: t("courses.filterSubjectIgualdad") },
    { value: "Seguridad", label: t("courses.filterSubjectSeguridad") },
  ];

  const monthNames = t("agenda.months").split(",");
  const FILTER_MESES = [
    { value: "", label: t("courses.all") },
    ...monthNames.map((m) => ({ value: m, label: m })),
  ];

  const FILTER_CENTROS = [
    { value: "", label: t("courses.all") },
    {
      value: "CF DE SEGURIDAD EN LA CIRCULACION",
      label: t("courses.filterCenterSeguridadCirculacion"),
    },
    {
      value: "CF DIRECTIVA Y DE GESTION",
      label: t("courses.filterCenterDirectiva"),
    },
    { value: "CF TECNOLOGICA", label: t("courses.filterCenterTecnologica") },
    {
      value: "Centro de Formación Territorial",
      label: t("courses.filterCenterTerritorial"),
    },
    {
      value: "CENTRO DE FORMACIÓN VIRTUAL",
      label: t("courses.filterCenterVirtual"),
    },
  ];

  const FILTER_TIPOS = [
    { value: "", label: t("courses.all") },
    { value: "Curso Formación", label: t("courses.filterTypeFormacion") },
    { value: "Curso CFV", label: t("courses.filterTypeCFV") },
    { value: "Teleformación", label: t("courses.filterTypeTeleformacion") },
    { value: "Formación TV", label: t("courses.filterTypeTV") },
  ];

  const sortOptions = useMemo(() => {
    const options = [
      { value: "name", label: t("courses.name") },
      { value: "date", label: t("courses.date") },
      { value: "type", label: t("courses.type2") },
    ];
    if (activeTab === "mis-cursos")
      options.splice(1, 0, { value: "progress", label: t("courses.progress") });
    if (activeTab === "proximos")
      options.unshift({
        value: "requested",
        label: t("courses.requestedFirst"),
      });
    return options;
  }, [activeTab, t]);

  const convocatoriasPorCurso = useMemo(() => {
    const map = new Map();
    for (const conv of CONVOCATORIAS) {
      const list = map.get(conv.cursoId) ?? [];
      list.push(conv);
      map.set(conv.cursoId, list);
    }
    return map;
  }, []);

  const filteredCursos = useMemo(() => {
    let result = [...CURSOS_DATA];

    if (activeTab === "mis-cursos") {
      result = result.filter((c) => c.status !== "proximo");
    } else if (activeTab === "proximos") {
      result = result.filter((c) => c.status === "proximo");
    } else if (activeTab === "catalogo") {
      result = CURSOS_DATA;
    }

    if (activeTab === "mis-cursos") {
      const selectedStatuses = Object.entries(statusFilters)
        .filter(([_, v]) => v)
        .map(([k]) => k);
      if (selectedStatuses.length > 0) {
        result = result.filter((c) => {
          if (
            selectedStatuses.includes("inProgress") &&
            c.status === "en-proceso"
          )
            return true;
          if (
            selectedStatuses.includes("completed") &&
            c.status === "realizado"
          )
            return true;
          return false;
        });
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => c.title.toLowerCase().includes(q));
    }

    if (!activePills.includes(t("courses.all"))) {
      result = result.filter((c) =>
        c.tags.some((tag) => activePills.includes(tag)),
      );
    }

    if (filterMateria)
      result = result.filter((c) => c.materia === filterMateria);
    if (filterCenter) result = result.filter((c) => c.center === filterCenter);
    if (filterMonth) result = result.filter((c) => c.month === filterMonth);
    if (filterType) result = result.filter((c) => c.type === filterType);

    if (activeTab === "proximos" && sortField === "requested") {
      result.sort((a, b) => {
        const pa = SOLICITUD_PRIORITY[solicitudes[a.id] ?? ""] ?? 4;
        const pb = SOLICITUD_PRIORITY[solicitudes[b.id] ?? ""] ?? 4;
        if (pa !== pb) return pa - pb;
        return a.title.localeCompare(b.title);
      });
    } else {
      result.sort((a, b) => {
        let cmp = 0;
        if (sortField === "name") cmp = a.title.localeCompare(b.title);
        else if (sortField === "date")
          cmp = (a.month || "").localeCompare(b.month || "");
        else if (sortField === "type") cmp = a.type.localeCompare(b.type);
        else if (sortField === "progress") cmp = a.progress - b.progress;
        return sortOrder === "asc" ? cmp : -cmp;
      });
    }

    return result;
  }, [
    activeTab,
    searchQuery,
    statusFilters,
    activePills,
    filterMateria,
    filterCenter,
    filterMonth,
    filterType,
    solicitudes,
    sortField,
    sortOrder,
    t,
  ]);

  const convocatoriasCurso =
    mostrarSelectorConvocatoria !== null
      ? (convocatoriasPorCurso.get(mostrarSelectorConvocatoria) ?? [])
      : [];

  const togglePill = (pill) => {
    if (pill === t("courses.all")) {
      setActivePills([t("courses.all")]);
      return;
    }
    setActivePills((prev) => {
      const next = prev.filter((p) => p !== t("courses.all"));
      if (next.includes(pill)) {
        const filtered = next.filter((p) => p !== pill);
        return filtered.length === 0 ? [t("courses.all")] : filtered;
      }
      return [...next, pill];
    });
  };

  const toggleStatusFilter = (key) => {
    setStatusFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasActiveDetailFilters =
    !!filterMateria || !!filterCenter || !!filterMonth || !!filterType;

  const clearDetailFilters = () => {
    setFilterMateria("");
    setFilterCenter("");
    setFilterMonth("");
    setFilterType("");
  };

  const handleCursoClick = (cursoId) => {
    navigate(`/curso/${cursoId}`);
  };

  return (
    <ScreenLayout
      headerMode="top"
      onHelpClick={() => setShowGuide(true)}
    >
      {searchParams.get("tab") && (
        <div className="px-4 pt-3 pb-1">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[#659B35] hover:text-[#207041] text-sm font-medium"
          >
            <ChevronLeft size={18} />
            {t("back")}
          </button>
        </div>
      )}

      <div className="px-4 pb-2 overflow-x-auto" data-tutorial="cursos-tabs">
        <div className="flex border-b border-[#CCCCCC] dark:border-gray-700 min-w-fit gap-4">
          {["mis-cursos", "proximos", "catalogo"].map((tab) => {
            const labels = {
              "mis-cursos": t("courses.myCourses"),
              proximos: t("courses.upcoming"),
              catalogo: t("courses.catalog"),
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "text-[#207041] dark:text-[#85C34A]"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {labels[tab]}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#207041] dark:bg-[#85C34A] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-4 pb-3 flex items-center gap-2" data-tutorial="cursos-filters">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={16}
          />
          <input
            type="text"
            placeholder={t("courses.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A] shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors shadow-sm border ${
            hasActiveDetailFilters
              ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
              : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          }`}
        >
          <SlidersHorizontal size={16} />
          {t("courses.filter")}
        </button>
        <div className="relative">
          <button
            onClick={() => setShowSort((v) => !v)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors shadow-sm border bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <ArrowUpDown size={16} />
            <span className="hidden sm:inline">{t("courses.sortBy")} </span>
            <span className="font-medium text-[#207041] dark:text-[#85C34A]">
              {sortOptions.find((o) => o.value === sortField)?.label ?? ""}
            </span>
          </button>
          {showSort && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowSort(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-20 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-[#CCCCCC] dark:border-gray-700 py-1 w-44">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (sortField === opt.value) {
                        setSortOrder((prev) =>
                          prev === "asc" ? "desc" : "asc",
                        );
                      } else {
                        setSortField(opt.value);
                        setSortOrder("asc");
                      }
                      setShowSort(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      sortField === opt.value
                        ? "text-[#207041] dark:text-[#85C34A] font-semibold"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {opt.label}
                    {sortField === opt.value && (
                      <span className="text-xs">
                        {sortOrder === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {activeTab === "mis-cursos" && (
        <div className="px-4 pb-2 flex items-center gap-3 overflow-x-auto">
          <div className="flex gap-3 flex-shrink-0">
            {Object.entries(statusFilters).map(([key, value]) => {
              const label =
                key === "inProgress"
                  ? t("courses.statusInProgress")
                  : t("courses.statusCompleted");
              return (
                <button
                  key={key}
                  onClick={() => toggleStatusFilter(key)}
                  className="flex items-center gap-1.5 text-sm whitespace-nowrap"
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${value ? "bg-[#659B35] dark:bg-[#85C34A] border-[#659B35] dark:border-[#85C34A] text-white" : "border-gray-300 dark:border-gray-600"}`}
                  >
                    {value && (
                      <svg
                        viewBox="0 0 12 12"
                        fill="none"
                        className="w-2.5 h-2.5"
                      >
                        <path
                          d="M2 6l3 3 5-5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={
                      value
                        ? "text-[#207041] dark:text-[#85C34A] font-medium underline underline-offset-2"
                        : "text-gray-600 dark:text-gray-400"
                    }
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => togglePill(tag)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              activePills.includes(tag)
                ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="px-4 pb-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-[#CCCCCC] dark:border-gray-700 shadow-md p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
                {t("courses.advancedFilters")}
              </h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={18} />
              </button>
            </div>
            {[
              {
                label: t("courses.subject"),
                value: filterMateria,
                set: setFilterMateria,
                options: FILTER_MATERIAS,
              },
              {
                label: t("courses.center"),
                value: filterCenter,
                set: setFilterCenter,
                options: FILTER_CENTROS,
              },
              {
                label: t("courses.month"),
                value: filterMonth,
                set: setFilterMonth,
                options: FILTER_MESES,
              },
              {
                label: t("courses.type"),
                value: filterType,
                set: setFilterType,
                options: FILTER_TIPOS,
              },
            ].map(({ label, value, set, options }) => (
              <div key={label}>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                  {label}
                </label>
                <select
                  value={value}
                  onChange={(e) => set(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F5F5F5] dark:bg-gray-700 border border-[#CCCCCC] dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A]"
                >
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            {hasActiveDetailFilters && (
              <button
                onClick={clearDetailFilters}
                className="text-xs text-[#659B35] dark:text-[#85C34A] font-medium hover:text-[#207041] dark:hover:text-[#006633]"
              >
                {t("courses.clearFilters")}
              </button>
            )}
          </div>
        </div>
      )}

      <div className="px-4 pb-4 space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        {filteredCursos.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8 lg:col-span-2">
            {t("courses.noResults")}
          </p>
        ) : (
          filteredCursos.map((curso, ci) => (
            <div
              key={curso.id}
              onClick={() => handleCursoClick(curso.id)}
              data-tutorial={ci === 0 ? "cursos-card" : undefined}
              className={`bg-gradient-to-br from-[#659B35] to-[#207041] rounded-xl p-3.5 text-white shadow-sm ${"cursor-pointer hover:shadow-md active:scale-[0.98]"} transition-all`}
            >
              <div className="flex items-start gap-3 mb-2">
                <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                  <CourseIcon icon={curso.icon} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm leading-tight truncate">
                    {curso.title}
                  </h3>
                  {curso.fechaInicio && curso.fechaFin && (
                    <p className="text-[11px] text-white/70 mt-0.5">
                      {curso.fechaInicio} — {curso.fechaFin}
                    </p>
                  )}
                </div>
                {activeTab === "proximos" && curso.id in solicitudes && (
                  <StatusBadge status={solicitudes[curso.id]} t={t} />
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCursoClick(curso.id);
                  }}
                  className="text-white/70 hover:text-white transition-colors shrink-0"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="flex items-center gap-2 min-h-[28px]">
                {curso.progress > 0 ? (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white/70 rounded-full transition-all"
                          style={{ width: `${curso.progress}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-white/70 mt-0.5 truncate">
                        {curso.progress}% · {curso.modality}
                      </p>
                    </div>
                    {curso.status === "en-proceso" && curso.progress < 100 && (
                      <DonutChart progress={curso.progress} />
                    )}
                  </>
                ) : (
                  <>
                    {activeTab === "proximos" && !(curso.id in solicitudes) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSolicitandoId(curso.id);
                        }}
                        className="w-full text-xs bg-white/20 hover:bg-white/30 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        {t("courses.requestButton")}
                      </button>
                    )}
                    {activeTab === "proximos" && curso.id in solicitudes && (
                      <p className="text-xs text-white/70 flex-1 truncate">
                        {curso.modality}
                      </p>
                    )}
                    {activeTab === "mis-cursos" && (
                      <p className="text-xs text-white/70 flex-1 truncate">
                        {curso.modality}
                      </p>
                    )}
                    {activeTab === "catalogo" && (
                      <>
                        {curso.id in solicitudes ? (
                          <StatusBadge status={solicitudes[curso.id]} t={t} />
                        ) : curso.status === "realizado" ? (
                          <StatusBadge status="completado" t={t} />
                        ) : curso.status === "en-proceso" ? (
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="flex-1 min-w-0">
                              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-white/70 rounded-full transition-all"
                                  style={{ width: `${curso.progress}%` }}
                                />
                              </div>
                              <p className="text-[11px] text-white/70 mt-0.5 truncate">
                                {curso.progress}% · {curso.modality}
                              </p>
                            </div>
                            {curso.status === "en-proceso" &&
                              curso.progress < 100 && (
                                <DonutChart progress={curso.progress} />
                              )}
                          </div>
                        ) : (
                          <div className="flex-1 flex items-center gap-2">
                            <p className="text-xs text-white/70 truncate">
                              {curso.modality}
                            </p>
                            <span className="text-[10px] text-white/50">
                              {curso.materia}
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              {activeTab === "catalogo" &&
                !(curso.id in solicitudes) &&
                curso.status !== "en-proceso" &&
                curso.status !== "realizado" && (
                  <div className="mt-2 pt-2 border-t border-white/15">
                    {convocatoriasPorCurso.has(curso.id) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMostrarSelectorConvocatoria(curso.id);
                        }}
                        className="w-full text-[11px] bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Calendar size={12} />
                        {t("courses.selectConvocatoriaAction")}
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNecesidadCurso({
                            id: curso.id,
                            title: curso.title,
                            materia: curso.materia,
                          });
                        }}
                        className="w-full text-[11px] bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <FileText size={12} />
                        {t("courses.requestAsNeed")}
                      </button>
                    )}
                  </div>
                )}
            </div>
          ))
        )}
      </div>

      {mostrarSelectorConvocatoria !== null && (
        <ConvocatoriaSelectorModal
          convocatorias={convocatoriasCurso}
          t={t}
          onSelect={(conv) => {
            setMostrarSelectorConvocatoria(null);
            setConvocatoriaSeleccionada(conv.cursoId);
            setSolicitandoId(conv.cursoId);
          }}
          onClose={() => setMostrarSelectorConvocatoria(null)}
        />
      )}

      {necesidadCurso && (
        <NecesidadModal
          cursoTitle={necesidadCurso.title}
          cursoMateria={necesidadCurso.materia}
          t={t}
          onSave={(data) => {
            setNecesidadSuccess(true);
            setNecesidadCurso(null);
            setTimeout(() => setNecesidadSuccess(false), 2000);
          }}
          onClose={() => setNecesidadCurso(null)}
        />
      )}

      {necesidadSuccess && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#207041] text-white px-4 py-2 rounded-xl shadow-lg text-sm font-semibold animate-bounce">
          {t("courses.needsSuccess")}
        </div>
      )}

      {solicitandoId !== null && !convocatoriaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {t("courses.requestModalTitle")}
              </h3>
              <button
                onClick={() => {
                  setSolicitandoId(null);
                  setTipoSolicitud(null);
                  setHelpVisible(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {t("courses.requestTypeLabel")}
            </p>

            {["oficial", "libre", "banda"].map((tipo) => (
              <div key={tipo} className="mb-3">
                <label
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    tipoSolicitud === tipo
                      ? "border-[#659B35] bg-[#659B35]/5"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipoSolicitud"
                    checked={tipoSolicitud === tipo}
                    onChange={() => setTipoSolicitud(tipo)}
                    className="accent-[#659B35]"
                  />

                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                        {tipo === "oficial"
                          ? t("courses.official")
                          : tipo === "libre"
                            ? t("courses.free")
                            : t("courses.band")}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHelpVisible(helpVisible === tipo ? null : tipo);
                        }}
                        className="text-gray-400 hover:text-[#659B35] transition-colors"
                      >
                        <HelpCircle size={16} />
                      </button>
                    </div>
                    {helpVisible === tipo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                        {tipo === "oficial" && t("courses.officialDesc")}
                        {tipo === "libre" && t("courses.freeDesc")}
                        {tipo === "banda" && t("courses.bandDesc")}
                      </p>
                    )}
                  </div>
                </label>
              </div>
            ))}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSolicitandoId(null);
                  setTipoSolicitud(null);
                  setHelpVisible(null);
                  setConvocatoriaSeleccionada(null);
                }}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {t("courses.cancel")}
              </button>
              <button
                disabled={!tipoSolicitud}
                onClick={() => {
                  if (solicitandoId !== null && tipoSolicitud !== null) {
                    setSolicitudes((prev) => ({
                      ...prev,
                      [solicitandoId]: "pendiente",
                    }));
                  }
                  setSolicitandoId(null);
                  setTipoSolicitud(null);
                  setHelpVisible(null);
                  setConvocatoriaSeleccionada(null);
                }}
                className={`flex-1 py-2.5 font-semibold text-sm rounded-xl transition-colors ${
                  tipoSolicitud
                    ? "bg-[#659B35] dark:bg-[#85C34A] text-white hover:bg-[#207041] dark:hover:bg-[#006633]"
                    : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }`}
              >
                {t("courses.request")}
              </button>
            </div>
          </div>
        </div>
      )}
      {showTutorial && (
        <TutorialOverlay
          steps={TUTORIALS.cursos.steps}
          tutorialTitle={TUTORIALS.cursos.title}
          tutorialKey="cursos"
          onClose={() => setShowTutorial(false)}
          onQuickGuide={() => { setShowTutorial(false); setShowGuide(true); }}
        />
      )}

      <ContextualHelp
        helpKey="cursos"
        open={showGuide}
        onClose={() => setShowGuide(false)}
        onStartTutorial={() => { setShowGuide(false); setShowTutorial(true); }}
      />
    </ScreenLayout>
  );
}
