import { useState, useMemo } from "react";
import { FileText, Search } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { MOVILIDAD_SOLICITUDES } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

export function MovilidadSolicitudesScreen() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const ALL_KEY = "__all__";
  const [filtroEstado, setFiltroEstado] = useState(ALL_KEY);

  const filtered = useMemo(() => {
    let items = MOVILIDAD_SOLICITUDES;
    if (filtroEstado !== ALL_KEY) {
      items = items.filter((s) => s.estado === filtroEstado);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q),
      );
    }
    return items;
  }, [filtroEstado, searchQuery]);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("mobilityRequests.title")}
      helpKey="movilidad-solicitudes"
    >
      <div className="px-4 pb-3">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder={t("mobilityRequests.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A] shadow-sm"
          />
        </div>
      </div>

      <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
        {[ALL_KEY, "pendiente", "aprobada", "rechazada"].map((estado) => (
          <button
            key={estado}
            onClick={() => setFiltroEstado(estado)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              filtroEstado === estado
                ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700"
            }`}
          >
            {estado === ALL_KEY
              ? t("mobilityRequests.all")
              : estado === "aprobada"
                ? t("mobilityRequests.approved")
                : estado === "rechazada"
                  ? t("mobilityRequests.rejected")
                  : t("mobilityRequests.pending")}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3 pb-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            {t("mobilityRequests.noResults")}
          </p>
        ) : (
          filtered.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-[#659B35] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {s.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {s.description}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        s.estado === "aprobada"
                          ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40"
                          : s.estado === "rechazada"
                            ? "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40"
                            : "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/40"
                      }`}
                    >
                      {s.estado === "aprobada"
                        ? t("mobilityRequests.approved")
                        : s.estado === "rechazada"
                          ? t("mobilityRequests.rejected")
                          : t("mobilityRequests.pending")}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {s.tipo}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      {s.fecha}
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
