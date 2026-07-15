import { useState, useMemo } from "react";
import { ChevronDown, Search, Heart, FileText, ArrowUpRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { ScreenLayout } from "./ScreenLayout";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { NuevaSolicitudModal } from "./NuevaSolicitudModal";
import { NECESIDADES, CURRENT_USER_NAME } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

const MATERIAS = Array.from(new Set(NECESIDADES.map((n) => n.materia))).sort();

const CURRENT_YEAR = new Date().getFullYear();
const NEXT_YEAR = CURRENT_YEAR + 1;

export function CapturaNecesidadesScreen() {
  const { t, formatDate } = useI18n();
  const [searchParams] = useSearchParams();
  const [necesidades, setNecesidades] = useState(NECESIDADES);
  const [selectedYear, setSelectedYear] = useState(
    searchParams.get("year") === "proximo" ? NEXT_YEAR : CURRENT_YEAR,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [materiaFilter, setMateriaFilter] = useState("");
  const [showBorradores, setShowBorradores] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [selectedNecesidad, setSelectedNecesidad] = useState(null);
  const [showModal, setShowModal] = useState(
    searchParams.get("solicitar") === "true",
  );

  const handleAddSolicitud = ({
    area,
    title,
    description,
    isBorrador,
    year,
  }) => {
    const nueva = {
      id: Math.max(0, ...necesidades.map((n) => n.id)) + 1,
      title,
      materia: area,
      description,
      likes: 0,
      liked: false,
      date: formatDate(new Date()),
      isBorrador,
      year,
    };
    setNecesidades((prev) => [nueva, ...prev]);
  };

  const necesidadesFiltradas = useMemo(() => {
    let result = [...necesidades];

    result = result.filter((n) => n.year === selectedYear);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.materia.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q),
      );
    }

    if (materiaFilter) {
      result = result.filter((n) => n.materia === materiaFilter);
    }

    if (showBorradores) {
      result = result.filter((n) => n.isBorrador);
    }

    if (sortBy === "desc") {
      result.sort((a, b) => b.likes - a.likes);
    } else if (sortBy === "asc") {
      result.sort((a, b) => a.likes - b.likes);
    }

    return result;
  }, [
    necesidades,
    selectedYear,
    searchQuery,
    materiaFilter,
    showBorradores,
    sortBy,
  ]);

  const handleToggleLike = (id) => {
    setNecesidades((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              liked: !n.liked,
              likes: n.liked ? n.likes - 1 : n.likes + 1,
            }
          : n,
      ),
    );
  };

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("needs.title")}
      helpKey="captura-necesidades"
      tutorialKey="captura-necesidades"
    >
      <div className="px-4 pt-3 pb-1" data-tutorial="necesidades-year">
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
          <button
            onClick={() => setSelectedYear(CURRENT_YEAR)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedYear === CURRENT_YEAR
                ? "bg-white dark:bg-gray-600 text-[#207041] dark:text-[#85C34A] shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t("needs.currentYear").replace("{year}", String(CURRENT_YEAR))}
          </button>
          <button
            onClick={() => setSelectedYear(NEXT_YEAR)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedYear === NEXT_YEAR
                ? "bg-white dark:bg-gray-600 text-[#207041] dark:text-[#85C34A] shadow-sm"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {t("needs.nextYear").replace("{year}", String(NEXT_YEAR))}
          </button>
        </div>
      </div>

      <div className="px-4 pt-2 pb-2">
        <button
          data-tutorial="necesidades-crear"
          onClick={() => setShowModal(true)}
          className="w-full bg-[#659B35] hover:bg-[#207041] active:bg-[#006633] text-white font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors shadow-sm"
        >
          {t("needs.createRequest")}
        </button>
      </div>

      <div className="px-4 py-1.5" data-tutorial="necesidades-filtros">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t("needs.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-[#CCCCCC] dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] transition-shadow"
          />
        </div>
      </div>

      <div className="px-4 py-1.5 flex gap-2">
        <div className="relative flex-1">
          <select
            value={materiaFilter}
            onChange={(e) => setMateriaFilter(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] border border-[#CCCCCC] dark:border-gray-600 pr-8 transition-shadow"
          >
            <option value="">{t("needs.bySubject")}</option>
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

        <label className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-[#CCCCCC] dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 cursor-pointer select-none hover:border-[#659B35] transition-colors flex-shrink-0">
          <input
            type="checkbox"
            checked={showBorradores}
            onChange={(e) => setShowBorradores(e.target.checked)}
            className="accent-[#659B35] w-4 h-4"
          />

          <span className="whitespace-nowrap">{t("needs.myDrafts")}</span>
        </label>

        <div className="relative flex-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] border border-[#CCCCCC] dark:border-gray-600 pr-8 transition-shadow"
          >
            <option value="">{t("needs.mostLiked")}</option>
            <option value="desc">{t("needs.mostPopular")}</option>
            <option value="asc">{t("needs.leastPopular")}</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll pb-4 pt-1 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        {necesidadesFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={48} className="mb-3" />
            <p className="text-sm">{t("needs.noResults")}</p>
          </div>
        ) : (
          <div className="space-y-3 px-4" data-tutorial="necesidades-list">
            {necesidadesFiltradas.map((nec) => (
              <button
                key={nec.id}
                onClick={() => setSelectedNecesidad(nec)}
                className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700 text-left hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-2 leading-snug">
                  {nec.title}
                </h3>

                <span className="inline-block bg-[#006633] text-white text-[10px] font-bold px-2 py-0.5 rounded mb-2.5 uppercase tracking-wide">
                  {t("needs.materia").replace("{materia}", nec.materia)}
                </span>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3 line-clamp-2">
                  {nec.description}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-700">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(nec.id);
                    }}
                    className="flex items-center gap-1.5 text-sm group"
                  >
                    <Heart
                      size={18}
                      className={`transition-colors ${
                        nec.liked
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 group-hover:text-red-400"
                      }`}
                    />

                    <span className="text-gray-600 dark:text-gray-400 text-xs">
                      {t("needs.like")}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                      {nec.likes}
                    </span>
                  </button>

                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {t("needs.requestDate").replace("{date}", nec.date)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
        </div>
      </div>

      <NuevaSolicitudModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddSolicitud}
        availableAreas={MATERIAS}
        userName={CURRENT_USER_NAME}
        defaultYear={selectedYear}
      />

      <PopupOverlay
        open={!!selectedNecesidad}
        onClose={() => setSelectedNecesidad(null)}
      >
        {selectedNecesidad &&
          (() => {
            const n = selectedNecesidad;
            return (
              <DetailCard
                color="#006633"
                icon={<FileText size={32} />}
                title={n.title}
                subtitle={t("needs.materia").replace("{materia}", n.materia)}
                badges={
                  <>
                    <span className="text-gray-500">
                      {t("needs.requestDate").replace("{date}", n.date)}
                    </span>
                    {n.isBorrador && (
                      <>
                        <span>·</span>
                        <span className="bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-300 px-2 py-0.5 rounded-full font-semibold text-xs">
                          Borrador
                        </span>
                      </>
                    )}
                  </>
                }
                action={
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => {
                        handleToggleLike(n.id);
                        setSelectedNecesidad({
                          ...n,
                          liked: !n.liked,
                          likes: n.liked ? n.likes - 1 : n.likes + 1,
                        });
                      }}
                      className="flex items-center gap-1.5 text-sm group"
                    >
                      <Heart
                        size={20}
                        className={`transition-colors ${
                          n.liked
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 group-hover:text-red-400"
                        }`}
                      />
                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {t("needs.like")}
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-bold">
                        {n.likes}
                      </span>
                    </button>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t("needs.requestDate").replace("{date}", n.date)}
                    </span>
                  </div>
                }
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {n.description}
                </p>
              </DetailCard>
            );
          })()}
      </PopupOverlay>
    </ScreenLayout>
  );
}
