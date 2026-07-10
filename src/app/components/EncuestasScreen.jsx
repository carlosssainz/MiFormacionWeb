import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  ChevronsUpDown,
} from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { ENCUESTAS } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

function parseDate(d) {
  const [day, month, year] = d.split("/");
  return `${year}-${month}-${day}`;
}

export function EncuestasScreen() {
  const { t } = useI18n();
  const { role } = useAuth();
  const [searchParams] = useSearchParams();
  const CATEGORIAS = [
    { key: "encuestas", label: t("surveys.title") },
    { key: "satisfaccion", label: t("surveys.satisfaction") },
    { key: "transferencia", label: t("surveys.transfer") },
  ];
  const [activeTab, setActiveTab] = useState("encuestas");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [soloRealizadas, setSoloRealizadas] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedEncuesta, setSelectedEncuesta] = useState(null);
  const [surveyOpenId, setSurveyOpenId] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState(
    () => searchParams.get("filtro") || "todos",
  );
  const ESTADO_FILTROS = [
    { key: "todos", label: t("surveys.all") },
    { key: "pendientes", label: t("surveys.filterPending") },
    { key: "realizados", label: t("surveys.filterCompleted") },
  ];

  const años = useMemo(() => {
    const set = new Set(ENCUESTAS.map((e) => e.año));
    return Array.from(set).sort((a, b) => b - a);
  }, []);

  const transferenciaAlumnos = useMemo(() => {
    if (activeTab !== "transferencia" || role !== "formador") return [];
    const nombres = [
      ...new Set(
        ENCUESTAS.filter((e) => e.categoria === "transferencia")
          .map((e) => e.evaluador)
          .filter(Boolean),
      ),
    ];
    return nombres.length > 0 ? nombres : ["Alberto Fernandez Sanchez"];
  }, [activeTab, role]);

  const filtered = useMemo(() => {
    let items = ENCUESTAS.filter((e) => e.categoria === activeTab);

    if (estadoFiltro === "pendientes") {
      items = items.filter((e) => e.estado === "no-realizado");
    } else if (estadoFiltro === "realizados") {
      items = items.filter((e) => e.estado === "realizado");
    }

    if (selectedYear !== "todos") {
      items = items.filter((e) => e.año === selectedYear);
    }

    if (soloRealizadas) {
      items = items.filter((e) => e.estado === "realizado");
    }

    items.sort((a, b) => {
      const cmp = parseDate(a.fechaInicio).localeCompare(
        parseDate(b.fechaInicio),
      );
      return sortAsc ? cmp : -cmp;
    });

    if (activeTab === "transferencia" && role === "formador") {
      const expanded = [];
      for (const item of items) {
        const alumnos = item.evaluador
          ? [item.evaluador]
          : [
              "Alberto Fernandez Sanchez",
              "María López García",
              "Carlos Rodríguez Pérez",
            ];
        for (const alumno of alumnos) {
          expanded.push({
            ...item,
            id: item.id * 100 + expanded.length,
            title: `${item.title} — ${alumno}`,
            evaluador: alumno,
          });
        }
      }
      return expanded;
    }

    return items;
  }, [activeTab, estadoFiltro, selectedYear, soloRealizadas, sortAsc, role]);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("surveys.title")}
      helpKey="encuestas"
    >
      <div className="flex-1 overflow-y-scroll scroll-container pb-4">
      <div className="min-h-[calc(100%+1px)]">
        {/* Tabs */}
        <div className="flex border-b border-[#CCCCCC] dark:border-gray-700 px-4 pt-2">
          {CATEGORIAS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setActiveTab(key);
                setSelectedEncuesta(null);
              }}
              className={`relative pb-2 mr-6 text-sm font-semibold transition-colors ${
                activeTab === key
                  ? "text-[#207041] dark:text-[#85C34A]"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {label}
              {activeTab === key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#207041] dark:bg-[#85C34A] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Filter pills */}
        <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto">
          {ESTADO_FILTROS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setEstadoFiltro(key)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                estadoFiltro === key
                  ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Ver filtros button */}
        <div className="px-4 pb-1">
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filtersOpen || selectedYear !== "todos" || soloRealizadas
                ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700"
            }`}
          >
            <SlidersHorizontal size={14} />
            {t("surveys.viewFilters")}
            {filtersOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="mx-4 mt-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-[#CCCCCC] dark:border-gray-700 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                {t("surveys.year")}
              </label>
              <select
                value={selectedYear === "todos" ? "todos" : selectedYear}
                onChange={(e) =>
                  setSelectedYear(
                    e.target.value === "todos"
                      ? "todos"
                      : Number(e.target.value),
                  )
                }
                className="w-full px-3 py-2 bg-[#F5F5F5] dark:bg-gray-700 border border-[#CCCCCC] dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A]"
              >
                <option value="todos">{t("surveys.all")}</option>
                {años.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={soloRealizadas}
                onChange={(e) => setSoloRealizadas(e.target.checked)}
                className="w-4 h-4 rounded border-[#CCCCCC] dark:border-gray-600 text-[#659B35] dark:text-[#85C34A] focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A]"
              />

              {t("surveys.onlyCompleted")}
            </label>

            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
                {t("surveys.orderByDate")}
              </label>
              <button
                onClick={() => setSortAsc(!sortAsc)}
                className="flex items-center gap-2 px-3 py-2 bg-[#F5F5F5] dark:bg-gray-700 border border-[#CCCCCC] dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ChevronsUpDown size={14} />
                {sortAsc ? t("surveys.oldestFirst") : t("surveys.newestFirst")}
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="px-4 pt-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
              <ClipboardCheck size={48} className="mb-3 opacity-50" />
              <p className="text-sm font-medium">{t("surveys.noResults")}</p>
              <p className="text-xs mt-1">{t("surveys.changeFilters")}</p>
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedEncuesta(item)}
                className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {t("surveys.course")}: {item.cursoId}
                    </p>
                    <span
                      className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.estado === "realizado"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                      }`}
                    >
                      {item.estado === "realizado"
                        ? t("surveys.completed")
                        : t("surveys.notCompleted")}
                    </span>
                  </div>
                </div>
              </button>
            ))
        )}
      </div>
      </div>
      </div>

      <PopupOverlay
        open={!!selectedEncuesta}
        onClose={() => setSelectedEncuesta(null)}
      >
        {selectedEncuesta &&
          (() => {
            const item = selectedEncuesta;
            return (
              <DetailCard
                color="#659B35"
                icon={<ClipboardCheck size={32} />}
                title={item.title}
                subtitle={`${t("surveys.course")}: ${item.cursoId}`}
                badges={
                  <>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold text-xs ${
                        item.estado === "realizado"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                          : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                      }`}
                    >
                      {item.estado === "realizado"
                        ? t("surveys.completed")
                        : t("surveys.notCompleted")}
                    </span>
                    <span>·</span>
                    <span className="text-gray-500">{item.categoria}</span>
                  </>
                }
                action={
                  surveyOpenId === item.id ? (
                    <div className="flex items-center justify-center gap-2 py-3 text-green-600 dark:text-green-400 text-sm font-semibold">
                      <ClipboardCheck size={16} />
                      {t("surveys.surveyOpened")}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSurveyOpenId(item.id)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold text-sm transition-colors"
                    >
                      <ClipboardCheck size={16} />
                      {t("surveys.openSurvey")}
                    </button>
                  )
                }
              >
                <div className="space-y-3 text-sm">
                  {item.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                  <div className="border-t border-[#CCCCCC] dark:border-gray-700 pt-3 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        {t("surveys.evaluator")}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.evaluador ||
                          (role === "alumno"
                            ? t("surveys.selfEvaluation")
                            : t("surveys.pendingAssign"))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        {t("surveys.startDate")}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.fechaInicio}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">
                        {t("surveys.endDate")}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.fechaFin}
                      </span>
                    </div>
                  </div>
                </div>
              </DetailCard>
            );
          })()}
      </PopupOverlay>
    </ScreenLayout>
  );
}
