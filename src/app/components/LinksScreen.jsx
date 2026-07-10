import { useState, useMemo } from "react";
import { Search, Link as LinkIcon, ExternalLink } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { LINKS } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

function getFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "";
  }
}

function LinkCard({ link }) {
  const [imgError, setImgError] = useState(false);
  const faviconUrl = getFaviconUrl(link.url);

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-600">
          {imgError || !faviconUrl ? (
            <LinkIcon size={20} className="text-[#659B35]" />
          ) : (
            <img
              src={faviconUrl}
              alt=""
              className="w-6 h-6"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              {link.title}
            </h3>
            <ExternalLink
              size={14}
              className="text-gray-400 dark:text-gray-500 flex-shrink-0"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {link.description}
          </p>
          <span className="text-[10px] font-medium text-[#659B35] dark:text-[#85C34A] bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full mt-2 inline-block">
            {link.categoria}
          </span>
        </div>
      </div>
    </a>
  );
}

export function LinksScreen() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoria, setCategoria] = useState("all");

  const categorias = useMemo(() => {
    return ["all", ...new Set(LINKS.map((l) => l.categoria))];
  }, []);

  const filtered = useMemo(() => {
    let items = LINKS;
    if (categoria !== "all") {
      items = items.filter((l) => l.categoria === categoria);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q),
      );
    }
    return items;
  }, [categoria, searchQuery]);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("links.title")}
      helpKey="links"
    >
      <div className="px-4 pb-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder={t("links.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A] shadow-sm"
          />
        </div>
      </div>

      <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
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
            {t("links.noResults")}
          </p>
        ) : (
          filtered.map((l) => <LinkCard key={l.id} link={l} />)
        )}
      </div>
    </ScreenLayout>
  );
}
