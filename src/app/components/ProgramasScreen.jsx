import { useState, useMemo } from "react";
import { Award, Search } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { PROGRAMAS } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

export function ProgramasScreen() {
  const { t } = useI18n();
  const CATEGORIAS = [
    t("programas.all"),
    t("programs.adaptation"),
    t("programs.welcome"),
    t("programs.internship"),
    t("programs.superior"),
  ];
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoria, setActiveCategoria] = useState(t("programas.all"));

  const filtered = useMemo(() => {
    let result = [...PROGRAMAS];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (activeCategoria !== t("programas.all")) {
      result = result.filter((p) => p.categoria === activeCategoria);
    }
    return result;
  }, [searchQuery, activeCategoria]);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("programs.title")}
      helpKey="programas"
    >
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder={t("programs.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A]"
          />
        </div>
      </div>

      <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
        {CATEGORIAS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategoria(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              activeCategoria === cat
                ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3 pb-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={48} className="mb-3" />
            <p className="text-sm">{t("programs.noResults")}</p>
          </div>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#659B35] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <Award size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[10px] font-medium text-[#659B35] dark:text-[#85C34A] bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      {p.estado}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                      {p.categoria}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {p.fechaInicio} - {p.fechaFin}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </ScreenLayout>
  );
}
