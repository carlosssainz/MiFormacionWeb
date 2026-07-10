import { useState, useMemo } from "react";
import { ChevronDown, Search, BookOpen } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { TEMARIOS } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

const MATERIAS = Array.from(new Set(TEMARIOS.map((t) => t.materia))).sort();

export function TemariosScreen() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [materiaFilter, setMateriaFilter] = useState("");

  const temariosFiltrados = useMemo(() => {
    let result = [...TEMARIOS];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.materia.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q),
      );
    }

    if (materiaFilter) {
      result = result.filter((t) => t.materia === materiaFilter);
    }

    return result;
  }, [searchQuery, materiaFilter]);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("syllabus.title")}
      helpKey="temarios"
    >
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t("syllabus.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-[#CCCCCC] dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] transition-shadow"
          />
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <select
            value={materiaFilter}
            onChange={(e) => setMateriaFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] border border-[#CCCCCC] dark:border-gray-600 pr-8 transition-shadow"
          >
            <option value="">{t("syllabus.bySubject")}</option>
            {MATERIAS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        {temariosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={48} className="mb-3" />
            <p className="text-sm">{t("syllabus.noResults")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {temariosFiltrados.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-4"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#659B35]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-[#659B35]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug mb-1">
                      {item.title}
                    </h3>
                    <span className="inline-block bg-[#006633] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">
                      {item.materia}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                  <span>
                    {t("syllabus.pages").replace(
                      "{pages}",
                      String(item.paginas),
                    )}
                  </span>
                  <span>
                    {t("syllabus.updated").replace(
                      "{date}",
                      item.fechaActualizacion,
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ScreenLayout>
  );
}
