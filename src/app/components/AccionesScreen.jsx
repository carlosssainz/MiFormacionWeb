import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  QrCode,
  PenSquare,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Search,
  CheckCircle,
  Clock,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { PanelCard } from "./PanelCard";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { EmptyState } from "./EmptyState";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

const TIPO_CONFIG = {
  asistencia: { icon: QrCode, label: "Asistencia", color: "#6BCB77" },
  firma: { icon: PenSquare, label: "Firma", color: "#FF8C6B" },
  encuesta: { icon: ClipboardCheck, label: "Encuesta", color: "#6BB5FF" },
  examen: { icon: ClipboardList, label: "Examen", color: "#9B8FFF" },
  necesidad: { icon: FileText, label: "Necesidad", color: "#FFD93D" },
  mostrar_qr: { icon: QrCode, label: "Mostrar QR", color: "#207041" },
};

export function AccionesScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { acciones, accionesHistorico, completarAccion, role } = useAuth();
  const [activeTab, setActiveTab] = useState("pendientes");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAccionId, setSelectedAccionId] = useState(null);

  const pendientes = useMemo(
    () => acciones.filter((a) => a.estado === "pendiente" && (a.tipo !== "mostrar_qr" || role === "formador")),
    [acciones, role],
  );

  const realizadas = useMemo(
    () => acciones.filter((a) => a.estado === "realizada" && (a.tipo !== "mostrar_qr" || role === "formador")),
    [acciones, role],
  );

  const filteredPendientes = useMemo(() => {
    if (!searchQuery.trim()) return pendientes;
    const q = searchQuery.toLowerCase();
    return pendientes.filter(
      (a) =>
        a.titulo.toLowerCase().includes(q) ||
        a.descripcion.toLowerCase().includes(q),
    );
  }, [pendientes, searchQuery]);

  const filteredRealizadas = useMemo(() => {
    if (!searchQuery.trim()) return realizadas;
    const q = searchQuery.toLowerCase();
    return realizadas.filter(
      (a) =>
        a.titulo.toLowerCase().includes(q) ||
        a.descripcion.toLowerCase().includes(q),
    );
  }, [realizadas, searchQuery]);

  const handleOpenAccion = (id) => {
    setSelectedAccionId(id);
  };

  const selectedAccion =
    selectedAccionId !== null
      ? acciones.find((a) => a.id === selectedAccionId)
      : null;

  const renderHistoricoCard = (accion) => {
    const cfg = TIPO_CONFIG[accion.tipo] || TIPO_CONFIG.asistencia;
    const IconComponent = cfg.icon;

    return (
      <PanelCard
        key={`hist-${accion.id}`}
        icon={<IconComponent size={20} />}
        iconColor={cfg.color}
        title={accion.titulo}
        description={
          accion.fechaRealizacion
            ? `${accion.descripcion} · Completado ${new Date(accion.fechaRealizacion).toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" })}`
            : accion.descripcion
        }
        completed
        className="opacity-60"
      />
    );
  };

  return (
    <ScreenLayout
      headerMode="top"
      scrollable={false}
      helpKey="acciones"
      hideSearch
    >
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-[#659B35] hover:text-[#207041] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-[#207041] dark:text-[#85C34A]">
            Acciones Pendientes
          </h1>
        </div>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Buscar acciones..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-[#CCCCCC] dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] transition-shadow"
          />
        </div>
      </div>

      <div className="px-4 pb-2 flex gap-2">
        <button
          onClick={() => setActiveTab("pendientes")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "pendientes"
              ? "bg-[#659B35] text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          Pendientes ({pendientes.length})
        </button>
        <button
          onClick={() => setActiveTab("realizadas")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "realizadas"
              ? "bg-[#659B35] text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
          }`}
        >
          Realizadas
        </button>
      </div>

      <div className="flex-1 overflow-y-scroll pb-16 px-4 pt-1 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        {activeTab === "pendientes" && (
          <>
            {filteredPendientes.length === 0 ? (
              <EmptyState
                icon={<CheckCircle size={48} />}
                title="No tienes acciones pendientes"
              />
            ) : (
              <div className="space-y-3">
                {filteredPendientes.map((accion) => {
                  const cfg = TIPO_CONFIG[accion.tipo] || TIPO_CONFIG.asistencia;
                  const IconComponent = cfg.icon;
                  return (
                    <PanelCard
                      key={accion.id}
                      icon={<IconComponent size={20} />}
                      iconColor={cfg.color}
                      title={accion.titulo}
                      description={accion.descripcion}
                      onClick={() => handleOpenAccion(accion.id)}
                      statusBadge={
                        <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock size={10} />
                          Pendiente
                        </span>
                      }
                      action={
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (accion.enlace) {
                              navigate(accion.enlace, accion.targetId ? { state: { openPendienteId: accion.targetId } } : undefined);
                              if (accion.tipo === "mostrar_qr") {
                                completarAccion(accion.id);
                              }
                            } else {
                              completarAccion(accion.id);
                            }
                          }}
                          className="flex items-center gap-1.5 text-[#659B35] hover:text-[#207041] dark:text-[#85C34A] dark:hover:text-[#006633] text-sm font-semibold transition-colors"
                        >
                          Realizar
                          <ArrowRight size={16} />
                        </button>
                      }
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "realizadas" && (
          <>
            {filteredRealizadas.length === 0 && accionesHistorico.length === 0 ? (
              <EmptyState
                icon={<ClipboardList size={48} />}
                title="No hay acciones realizadas"
              />
            ) : (
              <div className="space-y-3">
                {filteredRealizadas.map((accion) => {
                  const cfg = TIPO_CONFIG[accion.tipo] || TIPO_CONFIG.asistencia;
                  const IconComponent = cfg.icon;
                  return (
                    <PanelCard
                      key={accion.id}
                      icon={<IconComponent size={20} />}
                      iconColor={cfg.color}
                      title={accion.titulo}
                      description={accion.descripcion}
                      completed
                      statusBadge={
                        <span className="bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle size={10} />
                          Hecho
                        </span>
                      }
                    />
                  );
                })}
                {accionesHistorico.length > 0 && (
                  <>
                    <div className="flex items-center gap-2 pt-4 pb-2">
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Histórico
                      </span>
                      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                    </div>
                    {accionesHistorico.map(renderHistoricoCard)}
                  </>
                )}
              </div>
            )}
          </>
        )}
        </div>
      </div>

      <PopupOverlay
        open={!!selectedAccion}
        onClose={() => setSelectedAccionId(null)}
      >
        {selectedAccion &&
          (() => {
            const cfg =
              TIPO_CONFIG[selectedAccion.tipo] || TIPO_CONFIG.asistencia;
            const IconComponent = cfg.icon;
            return (
              <DetailCard
                color={cfg.color}
                icon={<IconComponent size={32} />}
                title={selectedAccion.titulo}
                badges={
                  <>
                    <span
                      className="px-2 py-0.5 rounded-full font-semibold"
                      style={{
                        backgroundColor: cfg.color + "20",
                        color: cfg.color,
                      }}
                    >
                      {cfg.label}
                    </span>
                    <span>·</span>
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <Clock size={10} />
                      Pendiente
                    </span>
                    <span>·</span>
                    <span>
                      Creado:{" "}
                      {new Date(
                        selectedAccion.fechaCreacion,
                      ).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </span>
                  </>
                }
                action={
                  <button
                    onClick={() => {
                      if (selectedAccion.enlace) {
                        navigate(selectedAccion.enlace, selectedAccion.targetId ? { state: { openPendienteId: selectedAccion.targetId } } : undefined);
                        if (selectedAccion.tipo === "mostrar_qr") {
                          completarAccion(selectedAccion.id);
                        }
                        setSelectedAccionId(null);
                      } else {
                        completarAccion(selectedAccion.id);
                        setSelectedAccionId(null);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold text-sm transition-colors"
                  >
                    <ArrowRight size={16} />
                    Realizar
                  </button>
                }
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedAccion.descripcion}
                </p>
              </DetailCard>
            );
          })()}
      </PopupOverlay>
    </ScreenLayout>
  );
}
