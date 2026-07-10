import { useState, useMemo } from "react";
import { Search, FileText, Download, Clock } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { PanelCard } from "./PanelCard";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { EmptyState } from "./EmptyState";
import { DOCUMENTOS } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

export function DocsScreen() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoria, setCategoria] = useState("all");
  const [selectedDocId, setSelectedDocId] = useState(null);

  const categorias = useMemo(() => {
    return ["all", ...new Set(DOCUMENTOS.map((d) => d.categoria))];
  }, []);

  const filtered = useMemo(() => {
    let items = DOCUMENTOS;
    if (categoria !== "all") {
      items = items.filter((d) => d.categoria === categoria);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.description.toLowerCase().includes(q),
      );
    }
    return items;
  }, [categoria, searchQuery]);

  const selectedDoc =
    selectedDocId !== null
      ? DOCUMENTOS.find((d) => d.id === selectedDocId)
      : null;

  return (
    <ScreenLayout headerMode="back" backTitle={t("docs.title")} helpKey="docs">
      <div className="px-4 pb-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder={t("docs.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] shadow-sm"
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
          <EmptyState
            icon={<FileText size={48} />}
            title={t("docs.noResults")}
          />
        ) : (
          filtered.map((d) => (
            <PanelCard
              key={d.id}
              icon={<FileText size={20} />}
              iconColor="#659B35"
              title={d.title}
              description={d.description}
              onClick={() => setSelectedDocId(d.id)}
              badges={
                <>
                  <span className="font-medium text-[#659B35] dark:text-[#85C34A] bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    {d.categoria}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400">{d.tamanio}</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Clock size={10} /> {d.fecha}
                  </span>
                </>
              }
            />
          ))
        )}
      </div>

      <PopupOverlay
        open={!!selectedDoc}
        onClose={() => setSelectedDocId(null)}
      >
        {selectedDoc &&
          (() => {
            return (
              <DetailCard
                color="#659B35"
                icon={<FileText size={32} />}
                title={selectedDoc.title}
                badges={
                  <>
                    <span className="text-xs font-medium text-[#659B35] dark:text-[#85C34A] bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      {selectedDoc.categoria}
                    </span>
                    <span>·</span>
                    <span>{selectedDoc.tamanio}</span>
                    <span>·</span>
                    <span>{selectedDoc.fecha}</span>
                  </>
                }
                action={
                  <button className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold text-sm transition-colors">
                    <Download size={16} />
                    Descargar
                  </button>
                }
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedDoc.description}
                </p>
              </DetailCard>
            );
          })()}
      </PopupOverlay>
    </ScreenLayout>
  );
}
