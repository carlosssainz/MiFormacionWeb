import { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronDown, Search, Eye, Star } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { ALL_NOTICIAS } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

const CATEGORY_KEYS = {
  Portada: "news.cover",
  Fototeca: "news.photoLibrary",
  Videoteca: "news.videoLibrary",
  "En profundidad": "news.inDepth",
  Eventos: "news.events",
  "Notas de prensa": "news.pressReleases",
  "Mundo Ferroviario": "news.railwayWorld",
  Pódcast: "news.podcast",
};

const CATEGORIES = [
  "Todas",
  "Portada",
  "Fototeca",
  "Videoteca",
  "En profundidad",
  "Eventos",
  "Notas de prensa",
  "Mundo Ferroviario",
  "Pódcast",
];

const SORT_OPTIONS = [
  { value: "date-desc", field: "date", direction: "desc" },
  { value: "date-asc", field: "date", direction: "asc" },
  { value: "views-desc", field: "views", direction: "desc" },
  { value: "views-asc", field: "views", direction: "asc" },
  { value: "rating-desc", field: "rating", direction: "desc" },
  { value: "rating-asc", field: "rating", direction: "asc" },
];

const SORT_LABEL_KEYS = {
  "date-desc": "news.mostRecent",
  "date-asc": "news.oldest",
  "views-desc": "news.mostViewed",
  "views-asc": "news.leastViewed",
  "rating-desc": "news.bestRated",
  "rating-asc": "news.worstRated",
};

export function NoticiasScreen() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedNoticia, setSelectedNoticia] = useState(null);
  const [fromInicio, setFromInicio] = useState(false);

  useEffect(() => {
    const state = location.state;
    if (state?.openNoticiaId) {
      setSelectedNoticia(state.openNoticiaId);
      if (state.fromInicio) {
        setFromInicio(true);
      }
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [sortValue, setSortValue] = useState("date-desc");

  const allNoticias = ALL_NOTICIAS;

  const noticiasFiltradas = useMemo(() => {
    let result = [...allNoticias];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((n) => n.title.toLowerCase().includes(q));
    }

    if (selectedCategory !== "Todas") {
      result = result.filter((n) => n.category === selectedCategory);
    }

    const sortOption = SORT_OPTIONS.find((o) => o.value === sortValue);
    if (sortOption) {
      result.sort((a, b) => {
        let cmp = 0;
        if (sortOption.field === "date") {
          cmp = a.sortDate.localeCompare(b.sortDate);
        } else if (sortOption.field === "views") {
          cmp = a.views - b.views;
        } else {
          cmp = a.rating - b.rating;
        }
        return sortOption.direction === "desc" ? -cmp : cmp;
      });
    }

    return result;
  }, [searchQuery, selectedCategory, sortValue]);

  if (selectedNoticia !== null) {
    const noticia = allNoticias.find((n) => n.id === selectedNoticia);
    if (!noticia) {
      return (
        <ScreenLayout
          headerMode="back"
          backTitle={t("news.title")}
          helpKey="noticias"
          onBack={
            fromInicio
              ? () => navigate("/", { replace: true })
              : () => setSelectedNoticia(null)
          }
        >
          <div className="flex flex-col items-center justify-center px-8 py-16">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t("news.notFound")}
            </p>
            <button
              onClick={
                fromInicio
                  ? () => navigate("/", { replace: true })
                  : () => setSelectedNoticia(null)
              }
              className="mt-4 text-[#659B35] hover:text-[#207041] font-medium"
            >
              {t("news.back")}
            </button>
          </div>
        </ScreenLayout>
      );
    }

    return (
      <ScreenLayout
        headerMode="back"
        backTitle={t("news.title")}
        helpKey="noticias"
        onBack={
          fromInicio
            ? () => navigate("/", { replace: true })
            : () => setSelectedNoticia(null)
        }
      >
        <div className="bg-white dark:bg-gray-800">
          <img
            src={noticia.image}
            alt={noticia.title}
            className="w-full h-48 object-cover"
          />

          <div className="px-4 py-4">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>{noticia.date}</span>
              <span>·</span>
              <span className="bg-[#F5F5F5] dark:bg-gray-700 text-[#659B35] dark:text-[#85C34A] px-2 py-0.5 rounded-full font-medium">
                {t(CATEGORY_KEYS[noticia.category] ?? noticia.category)}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye size={12} />{" "}
                {t("news.views").replace(
                  "{views}",
                  noticia.views.toLocaleString(),
                )}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Star size={12} className="text-amber-400" /> {noticia.rating}
              </span>
            </div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {noticia.title}
            </h1>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {noticia.content}
            </p>
          </div>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("news.title")}
      helpKey="noticias"
      scrollable={false}
    >
      <div className="bg-white dark:bg-gray-800 px-4 pt-3 pb-2 border-b border-[#CCCCCC] dark:border-gray-700">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={t("news.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A]"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 px-4 py-2 border-b border-[#CCCCCC] dark:border-gray-700">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] pr-8"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "Todas"
                    ? t("news.category")
                    : t(CATEGORY_KEYS[cat] ?? cat)}
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
              value={sortValue}
              onChange={(e) => setSortValue(e.target.value)}
              className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] pr-8"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {t(SORT_LABEL_KEYS[opt.value])}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={16}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll pb-16 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        {noticiasFiltradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Search size={48} className="mb-3" />
            <p className="text-sm">{t("news.noResults")}</p>
          </div>
        ) : (
          noticiasFiltradas.map((noticia) => (
            <button
              key={noticia.id}
              onClick={() => setSelectedNoticia(noticia.id)}
              className="w-full bg-white dark:bg-gray-800 border-b border-[#CCCCCC] dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className="flex gap-3">
                <img
                  src={noticia.image}
                  alt={noticia.title}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1 line-clamp-2">
                    {noticia.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <span>{noticia.date}</span>
                    <span className="bg-[#F5F5F5] dark:bg-gray-700 text-[#659B35] dark:text-[#85C34A] px-1.5 py-0.5 rounded-full font-medium">
                      {t(CATEGORY_KEYS[noticia.category] ?? noticia.category)}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Eye size={11} /> {noticia.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <Star size={11} className="text-amber-400" />{" "}
                      {noticia.rating}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
        </div>
      </div>
    </ScreenLayout>
  );
}
