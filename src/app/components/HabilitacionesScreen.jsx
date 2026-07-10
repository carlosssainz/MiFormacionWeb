import { useState, useMemo } from "react";
import { Shield, UserCheck, Search } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { HABILITACIONES } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

export function HabilitacionesScreen() {
  const { t } = useI18n();
  const FILTROS_ESTADO = [
    t("habilitaciones.all"),
    t("habilitaciones.active"),
    t("habilitaciones.expiring"),
    t("habilitaciones.expired"),
  ];
  const estadoMap = {
    vigente: t("habilitaciones.active"),
    proxima: t("habilitaciones.expiring"),
    caducada: t("habilitaciones.expired"),
  };
  const [activeTab, setActiveTab] = useState("empleado");
  const [searchQuery, setSearchQuery] = useState("");
  const [estadoFilter, setEstadoFilter] = useState(t("habilitaciones.all"));

  const filtered = useMemo(() => {
    let result = HABILITACIONES.filter((h) => h.tipo === activeTab);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((h) => h.title.toLowerCase().includes(q));
    }

    if (estadoFilter !== t("habilitaciones.all")) {
      const estadoKey = Object.entries(estadoMap).find(
        ([_, v]) => v === estadoFilter,
      )?.[0];
      if (estadoKey) {
        result = result.filter((h) => h.estado === estadoKey);
      }
    }

    return result;
  }, [activeTab, searchQuery, estadoFilter]);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("habilitaciones.title")}
      helpKey="habilitaciones"
    >
      <div className="px-4 pt-2 pb-3">
        <div className="flex border-b border-[#CCCCCC] dark:border-gray-700 gap-4">
          <button
            onClick={() => setActiveTab("empleado")}
            className={`relative pb-2 text-sm font-semibold transition-colors ${activeTab === "empleado" ? "text-[#207041] dark:text-[#85C34A]" : "text-gray-500 dark:text-gray-400"}`}
          >
            <div className="flex items-center gap-1.5">
              <UserCheck size={16} />
              {t("habilitaciones.employee")}
            </div>
            {activeTab === "empleado" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#207041] dark:bg-[#85C34A] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("seguridad")}
            className={`relative pb-2 text-sm font-semibold transition-colors ${activeTab === "seguridad" ? "text-[#207041] dark:text-[#85C34A]" : "text-gray-500 dark:text-gray-400"}`}
          >
            <div className="flex items-center gap-1.5">
              <Shield size={16} />
              {t("habilitaciones.safety")}
            </div>
            {activeTab === "seguridad" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#207041] dark:bg-[#85C34A] rounded-full" />
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder={t("habilitaciones.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A]"
          />
        </div>
      </div>

      <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
        {FILTROS_ESTADO.map((est) => (
          <button
            key={est}
            onClick={() => setEstadoFilter(est)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
              estadoFilter === est
                ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-[#CCCCCC] dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500"
            }`}
          >
            {est}
          </button>
        ))}
      </div>

      <div className="px-4 space-y-3 pb-4">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
            {t("habilitaciones.noResults")}
          </p>
        ) : (
          filtered.map((h) => (
            <div
              key={h.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0 ${h.estado === "vigente" ? "bg-[#659B35]" : h.estado === "proxima" ? "bg-yellow-500" : "bg-red-400"}`}
                >
                  {h.tipo === "empleado" ? (
                    <UserCheck size={20} />
                  ) : (
                    <Shield size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                    {h.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        h.estado === "vigente"
                          ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40"
                          : h.estado === "proxima"
                            ? "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/40"
                            : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40"
                      }`}
                    >
                      {estadoMap[h.estado]}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {t("habilitaciones.obtained").replace(
                        "{date}",
                        h.fechaObtencion,
                      )}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {t("habilitaciones.expiry").replace(
                        "{date}",
                        h.fechaCaducidad,
                      )}
                    </p>
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
