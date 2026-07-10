import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { EXAMENES } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

function getDaysFromNow(dateStr) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function matchesFilter(sortDate, filterValue) {
  const days = getDaysFromNow(sortDate);
  if (days < 0) return false;
  switch (filterValue) {
    case "7d":
      return days <= 7;
    case "1m":
      return days <= 30;
    case "6m":
      return days <= 180;
    case "all":
      return days > 180;
    default:
      return true;
  }
}

export function ExamenesProcesoScreen() {
  const { t } = useI18n();
  const FILTER_OPTIONS = [
    { value: "7d", label: t("exams.upcoming.next7") },
    { value: "1m", label: t("exams.upcoming.nextMonth") },
    { value: "6m", label: t("exams.upcoming.next6") },
    { value: "all", label: t("exams.upcoming.over6") },
  ];
  const formatFilterLabel = (value) => {
    const opt = FILTER_OPTIONS.find((o) => o.value === value);
    return opt ? opt.label : t("exams.upcoming.next7");
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("7d");
  const [filterOpen, setFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const examenesFiltrados = useMemo(() => {
    let result = [...EXAMENES];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.ubicacion.toLowerCase().includes(q),
      );
    }

    result = result.filter((e) => matchesFilter(e.sortDate, filterValue));

    result.sort(
      (a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime(),
    );

    return result;
  }, [searchQuery, filterValue]);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("exams.inProcess.title")}
      helpKey="examenes-proceso"
    >
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t("exams.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-[#CCCCCC] dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] transition-shadow"
          />
        </div>
      </div>

      <div className="px-4 pb-2 relative" ref={dropdownRef}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
            {t("exams.filterByDate")}
          </span>
          <button
            onClick={() => setFilterOpen((v) => !v)}
            className="flex-1 flex items-center justify-between px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-[#CCCCCC] dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] transition-shadow"
          >
            <span>{formatFilterLabel(filterValue)}</span>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform duration-200 ${filterOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {filterOpen && (
          <div className="absolute left-4 right-4 top-full mt-1 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFilterValue(opt.value);
                  setFilterOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${filterValue === opt.value ? "border-[#659B35]" : "border-gray-400"}`}
                >
                  {filterValue === opt.value && (
                    <span className="w-2 h-2 rounded-full bg-[#659B35]" />
                  )}
                </span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-scroll pb-4 pt-1 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        {examenesFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={48} className="mb-3" />
            <p className="text-sm">{t("exams.noResults")}</p>
          </div>
        ) : (
          <div className="space-y-3 px-4">
            {examenesFiltrados.map((exam) => (
              <div
                key={exam.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug flex-1">
                    {exam.title}
                  </h3>
                  {exam.confirmado && (
                    <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      <Check size={12} />
                      {t("exams.confirmed")}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                      {t("exams.date")}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {exam.fecha}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                      {t("exams.time")}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {exam.hora}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                      {t("exams.location")}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {exam.ubicacion}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">
                      {t("exams.duration")}
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      {exam.duracion}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </ScreenLayout>
  );
}
