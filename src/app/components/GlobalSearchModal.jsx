import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  BookOpen,
  FileText,
  Pill,
  Link as LinkIcon,
  Calendar,
  ClipboardList,
  Award,
  Shield,
  MessageSquare,
  Star,
  Zap,
} from "lucide-react";
import { globalSearch } from "../services/globalSearchService";
import { useI18n } from "../context/I18nContext";

const TYPE_LABEL_TO_KEY = {
  Cursos: "globalSearch.type.courses",
  Noticias: "globalSearch.type.news",
  Documentos: "globalSearch.type.docs",
  Píldoras: "globalSearch.type.pills",
  Links: "globalSearch.type.links",
  Agenda: "globalSearch.type.agenda",
  Exámenes: "globalSearch.type.exams",
  "Eventos / Jornadas": "globalSearch.type.events",
  Programas: "globalSearch.type.programs",
  Temarios: "globalSearch.type.syllabus",
  Habilitaciones: "globalSearch.type.habilitaciones",
  "Necesidades Formativas": "globalSearch.type.needs",
  Sugerencias: "globalSearch.type.suggestions",
  "Accesos Rápidos": "globalSearch.type.quickAccess",
};

const TYPE_ICONS = {
  "globalSearch.type.courses": <BookOpen size={16} />,
  "globalSearch.type.news": <FileText size={16} />,
  "globalSearch.type.docs": <FileText size={16} />,
  "globalSearch.type.pills": <Pill size={16} />,
  "globalSearch.type.links": <LinkIcon size={16} />,
  "globalSearch.type.agenda": <Calendar size={16} />,
  "globalSearch.type.exams": <ClipboardList size={16} />,
  "globalSearch.type.events": <Calendar size={16} />,
  "globalSearch.type.programs": <Award size={16} />,
  "globalSearch.type.syllabus": <BookOpen size={16} />,
  "globalSearch.type.habilitaciones": <Shield size={16} />,
  "globalSearch.type.needs": <ClipboardList size={16} />,
  "globalSearch.type.suggestions": <MessageSquare size={16} />,
  "globalSearch.type.quickAccess": <Zap size={16} />,
};

export function GlobalSearchModal({ open, onClose }) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
    if (!open) {
      setQuery("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const groupedResults = useMemo(() => {
    if (!query.trim()) return new Map();
    return globalSearch(query);
  }, [query]);

  const totalCount = useMemo(() => {
    let count = 0;
    for (const list of groupedResults.values()) count += list.length;
    return count;
  }, [groupedResults]);

  const handleSelect = useCallback(
    (result) => {
      navigate(result.route);
      onClose();
    },
    [navigate, onClose],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div className="relative mt-16 w-full max-w-xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Search size={20} className="text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("globalSearch.placeholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 bg-transparent focus:outline-none"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 ml-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-scroll scroll-container">
          <div className="min-h-[calc(100%+1px)]">
          {!query.trim() && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 px-6 text-center">
              <Search size={48} className="mb-3 opacity-50" />
              <p className="text-sm">{t("globalSearch.emptyTitle")}</p>
              <p className="text-xs mt-1">{t("globalSearch.emptyDesc")}</p>
            </div>
          )}

          {query.trim() && totalCount === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 px-6 text-center">
              <Search size={48} className="mb-3 opacity-50" />
              <p className="text-sm">{t("globalSearch.noResults")}</p>
              <p className="text-xs mt-1">{t("globalSearch.tryOtherTerms")}</p>
            </div>
          )}

          {Array.from(groupedResults.entries()).map(([typeLabel, items]) => (
            <div key={typeLabel}>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-900/50">
                <span className="text-[#659B35]">
                  {TYPE_ICONS[TYPE_LABEL_TO_KEY[typeLabel] ?? typeLabel] ?? (
                    <Star size={16} />
                  )}
                </span>
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {t(TYPE_LABEL_TO_KEY[typeLabel] ?? typeLabel)}
                </span>
                <span className="text-[11px] text-gray-400 ml-auto">
                  {items.length}
                </span>
              </div>
              {items.map((result, idx) => (
                <button
                  key={`${typeLabel}-${idx}`}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-800 last:border-b-0"
                >
                  <span className="flex-shrink-0 mt-0.5 text-gray-400">
                    {TYPE_ICONS[TYPE_LABEL_TO_KEY[typeLabel] ?? typeLabel] ?? (
                      <Star size={16} />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                      {result.title}
                    </div>
                    <div className="text-[12px] text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
                      {result.description}
                    </div>
                    {result.category && (
                      <span className="inline-block mt-1 text-[10px] font-medium text-[#659B35] bg-[#F0F7E8] dark:bg-[#1a2e1a] px-1.5 py-0.5 rounded">
                        {result.category}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ))}
          </div>
        </div>

        {totalCount > 0 && (
          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-[11px] text-gray-400 text-center">
            {t("globalSearch.results").replace(
              "{count}",
              totalCount.toString(),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
