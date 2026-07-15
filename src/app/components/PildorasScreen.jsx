import { useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { PILDORAS } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

export function PildorasScreen() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoria, setCategoria] = useState("all");

  const categorias = useMemo(() => {
    const cats = ["all", ...new Set(PILDORAS.map((p) => p.categoria))];
    return cats;
  }, []);

  const filtered = useMemo(() => {
    let items = PILDORAS;
    if (categoria !== "all") {
      items = items.filter((p) => p.categoria === categoria);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    return items;
  }, [categoria, searchQuery]);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("pills.title")}
      helpKey="pildoras"
      tutorialKey="pildoras"
    >
      <div className="px-4 pb-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            data-tutorial="pildoras-search"
            placeholder={t("pills.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A] shadow-sm"
          />
        </div>
      </div>

      <div className="px-4 pb-3 flex gap-2 overflow-x-auto" data-tutorial="pildoras-categorias">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoria(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              categoria === cat
                ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700"
            }`}
          >
            {cat === "all" ? t("all") : cat}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3 pb-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            {t("pills.noResults")}
          </p>
        ) : (
          filtered.map((p) => (
            <div
              key={p.id}
              data-tutorial="pildoras-list"
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#659B35] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <BookOpen size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {p.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {p.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-medium text-[#659B35] dark:text-[#85C34A] bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      {p.categoria}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {p.duracion}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {p.fecha}
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
