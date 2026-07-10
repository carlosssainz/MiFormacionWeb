import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Search,
  FileText,
  Package,
  CheckCircle,
  XCircle,
  User,
  AlertTriangle,
  PenSquare,
  ChevronRight,
  BookOpen,
  GraduationCap,
  ClipboardCheck,
  CalendarOff,
  ArrowUpDown,
} from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { PanelCard } from "./PanelCard";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { EmptyState } from "./EmptyState";
import { useAuth } from "../context/AuthContext";
import { FIRMAS_HISTORICO } from "../data/mockData";

const TIPO_OPTS = [
  { value: "todos", label: "Todos", icon: null },
  {
    value: "necesidad_formativa",
    label: "Necesidad Formativa",
    icon: <FileText size={14} />,
  },
  {
    value: "recepcion_material",
    label: "Recepción Material",
    icon: <Package size={14} />,
  },
  {
    value: "asistencia_curso",
    label: "Asistencia Curso",
    icon: <BookOpen size={14} />,
  },
  { value: "matricula", label: "Matrícula", icon: <GraduationCap size={14} /> },
  {
    value: "evaluacion",
    label: "Evaluación",
    icon: <ClipboardCheck size={14} />,
  },
  { value: "permiso", label: "Permiso", icon: <CalendarOff size={14} /> },
];

const SOLICITANTE_OPTS = [
  { value: "todos", label: "Todos" },
  { value: "yo", label: "Pedido por mí" },
  { value: "mi_responsable", label: "Mi responsable" },
];

const FIRMA_ICONS = {
  necesidad_formativa: FileText,
  recepcion_material: Package,
  asistencia_curso: BookOpen,
  matricula: GraduationCap,
  evaluacion: ClipboardCheck,
  permiso: CalendarOff,
};

const FIRMA_COLORS = {
  necesidad_formativa: "#3B82F6",
  recepcion_material: "#F59E0B",
  asistencia_curso: "#22C55E",
  matricula: "#A855F7",
  evaluacion: "#F43F5E",
  permiso: "#06B6D4",
};

export function PendientesFirmaScreen() {
  const { firmarAsistencia, pendientesFirma } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("pendientes");
  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todos");
  const [solicitanteFilter, setSolicitanteFilter] = useState("todos");
  const [sortOrder, setSortOrder] = useState("desc");
  const [confirmFirmaId, setConfirmFirmaId] = useState(null);
  const [firmandoId, setFirmandoId] = useState(null);
  const [selectedPendienteId, setSelectedPendienteId] = useState(null);

  useEffect(() => {
    if (location.state?.openPendienteId) {
      setSelectedPendienteId(location.state.openPendienteId);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const historico = useMemo(() => {
    const signedFromPendientes = pendientesFirma
      .filter((p) => p.estado === "firmado")
      .map((p) => ({
        id: p.id,
        tipo: p.tipo,
        titulo: p.titulo,
        solicitante: p.solicitante,
        solicitanteRole: p.solicitanteRole,
        fechaFirma: new Date().toISOString().split("T")[0],
        accion: "firmado",
      }));
    return [...signedFromPendientes, ...FIRMAS_HISTORICO];
  }, [pendientesFirma]);

  const pendingItems = useMemo(
    () => pendientesFirma.filter((p) => p.estado === "pendiente"),
    [pendientesFirma],
  );
  const pendingCount = pendingItems.length;

  const pendientesFiltrados = useMemo(() => {
    let result = pendingItems;

    if (tipoFilter !== "todos") {
      result = result.filter((p) => p.tipo === tipoFilter);
    }
    if (solicitanteFilter !== "todos") {
      result = result.filter((p) => p.solicitanteRole === solicitanteFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.titulo.toLowerCase().includes(q) ||
          p.solicitante.toLowerCase().includes(q) ||
          p.descripcion.toLowerCase().includes(q) ||
          (p.materia && p.materia.toLowerCase().includes(q)) ||
          (p.material && p.material.toLowerCase().includes(q)),
      );
    }

    result.sort((a, b) => {
      const cmp = a.sortDate.localeCompare(b.sortDate);
      return sortOrder === "desc" ? -cmp : cmp;
    });

    return result;
  }, [pendingItems, tipoFilter, solicitanteFilter, searchQuery, sortOrder]);

  const historicoFiltrado = useMemo(() => {
    let result = historico;

    if (tipoFilter !== "todos") {
      result = result.filter((h) => h.tipo === tipoFilter);
    }
    if (solicitanteFilter !== "todos") {
      result = result.filter((h) => h.solicitanteRole === solicitanteFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (h) =>
          h.titulo.toLowerCase().includes(q) ||
          h.solicitante.toLowerCase().includes(q),
      );
    }

    result.sort((a, b) => {
      const cmp = a.fechaFirma.localeCompare(b.fechaFirma);
      return sortOrder === "desc" ? -cmp : cmp;
    });

    return result;
  }, [historico, tipoFilter, solicitanteFilter, searchQuery, sortOrder]);

  const handleConfirmarFirma = () => {
    if (confirmFirmaId === null) return;
    const id = confirmFirmaId;
    setFirmandoId(id);
    setConfirmFirmaId(null);
    setTimeout(() => {
      firmarAsistencia(id);
      setFirmandoId(null);
      setSelectedPendienteId(null);
    }, 800);
  };

  const handleOpenPendiente = (id) => {
    setSelectedPendienteId(id);
  };

  const selectedPendiente =
    selectedPendienteId !== null
      ? pendientesFirma.find((p) => p.id === selectedPendienteId)
      : null;

  const formatTipo = (tipo) => {
    const opt = TIPO_OPTS.find((o) => o.value === tipo);
    return opt ? opt.label : tipo;
  };

  const tipoColor = (tipo) => {
    return FIRMA_COLORS[tipo] || "#207041";
  };

  return (
    <ScreenLayout
      headerMode="back"
      backTitle="Documentos"
      helpKey="pendientes-firma"
    >
      <div className="px-4 pt-3 pb-2">
        <div className="flex border-b border-[#CCCCCC] dark:border-gray-700 gap-6">
          <button
            onClick={() => setActiveTab("pendientes")}
            className={`relative pb-2 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "pendientes"
                ? "text-[#207041] dark:text-[#85C34A]"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Pendientes
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {pendingCount > 9 ? "9+" : pendingCount}
              </span>
            )}
            {activeTab === "pendientes" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#207041] dark:bg-[#85C34A] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("historico")}
            className={`relative pb-2 text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "historico"
                ? "text-[#207041] dark:text-[#85C34A]"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            Histórico
            {historico.length > 0 && (
              <span className="bg-gray-400 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                {historico.length}
              </span>
            )}
            {activeTab === "historico" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#207041] dark:bg-[#85C34A] rounded-full" />
            )}
          </button>
        </div>
      </div>

      <div className="px-4 pb-2 space-y-2">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder={
              activeTab === "pendientes"
                ? "Buscar por título, solicitante, materia..."
                : "Buscar en histórico..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 rounded-xl border border-[#CCCCCC] dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] transition-shadow"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {TIPO_OPTS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTipoFilter(opt.value)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border transition-colors ${
                tipoFilter === opt.value
                  ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-[#CCCCCC] dark:border-gray-700 hover:border-gray-400"
              }`}
            >
              {opt.icon}
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {SOLICITANTE_OPTS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSolicitanteFilter(opt.value)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border transition-colors ${
                  solicitanteFilter === opt.value
                    ? "bg-[#659B35] dark:bg-[#85C34A] text-white border-[#659B35] dark:border-[#85C34A]"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-[#CCCCCC] dark:border-gray-700 hover:border-gray-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-[#CCCCCC] dark:border-gray-700 hover:border-gray-400 transition-colors"
          >
            <ArrowUpDown size={12} />
            {sortOrder === "desc" ? "Más recientes" : "Más antiguos"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-scroll pb-4 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        {activeTab === "pendientes" && pendientesFiltrados.length === 0 && (
          <EmptyState
            icon={<CheckCircle size={48} />}
            title="No hay firmas pendientes"
            description="Todas las solicitudes están gestionadas"
          />
        )}

        {activeTab === "historico" && historicoFiltrado.length === 0 && (
          <EmptyState
            icon={<XCircle size={48} />}
            title="No hay registros en el histórico"
            description="Aún no se han realizado firmas"
          />
        )}

        {activeTab === "pendientes" && pendientesFiltrados.length > 0 && (
          <div className="space-y-3 px-4 pt-2">
            {pendientesFiltrados.map((p) => {
              const IconComponent = FIRMA_ICONS[p.tipo] || FileText;
              const color = tipoColor(p.tipo);
              return (
                <PanelCard
                  key={p.id}
                  icon={<IconComponent size={20} />}
                  iconColor={color}
                  title={p.titulo}
                  description={p.descripcion}
                  onClick={() => handleOpenPendiente(p.id)}
                  badges={
                    <>
                      <span
                        className="font-semibold uppercase tracking-wider"
                        style={{ color }}
                      >
                        {formatTipo(p.tipo)}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span
                        className={`font-medium px-1.5 py-0.5 rounded-full ${
                          p.solicitanteRole === "yo"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        }`}
                      >
                        {p.solicitanteRole === "yo"
                          ? "Pedido por mí"
                          : "Mi responsable"}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span className="text-gray-400">{p.solicitante}</span>
                    </>
                  }
                />
              );
            })}
          </div>
        )}

        {activeTab === "historico" && historicoFiltrado.length > 0 && (
          <div className="space-y-2 px-4 pt-2">
            {historicoFiltrado.map((h) => {
              const IconComponent = FIRMA_ICONS[h.tipo] || FileText;
              const color = tipoColor(h.tipo);
              return (
                <PanelCard
                  key={h.id}
                  icon={<IconComponent size={20} />}
                  iconColor={color}
                  title={h.titulo}
                  description={
                    <span>
                      {h.solicitante} · {h.fechaFirma}
                    </span>
                  }
                  completed
                  badges={
                    <>
                      <span
                        className="font-semibold uppercase tracking-wider"
                        style={{ color }}
                      >
                        {formatTipo(h.tipo)}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span
                        className={`font-medium px-1.5 py-0.5 rounded-full ${
                          h.accion === "firmado"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {h.accion === "firmado" ? "Aprobado" : "Rechazado"}
                      </span>
                      <span className="text-gray-400">·</span>
                      <span
                        className={`font-medium px-1.5 py-0.5 rounded-full ${
                          h.solicitanteRole === "yo"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                        }`}
                      >
                        {h.solicitanteRole === "yo"
                          ? "Pedido por mí"
                          : "Mi responsable"}
                      </span>
                    </>
                  }
                />
              );
            })}
          </div>
        )}
        </div>
      </div>

      {confirmFirmaId !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                ¿Confirmar firma?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                Al firmar confirmas que el solicitante cumple con los requisitos
                necesarios y autorizas esta gestión.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmFirmaId(null)}
                className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarFirma}
                className="flex-1 py-2.5 bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <PenSquare size={16} />
                Confirmar firma
              </button>
            </div>
          </div>
        </div>
      )}

      <PopupOverlay
        open={!!selectedPendiente}
        onClose={() => {
          setSelectedPendienteId(null);
          setConfirmFirmaId(null);
        }}
      >
        {selectedPendiente &&
          (() => {
            const color =
              FIRMA_COLORS[selectedPendiente.tipo] || "#207041";
            const IconComponent =
              FIRMA_ICONS[selectedPendiente.tipo] || FileText;
            return (
              <DetailCard
                color={color}
                icon={<IconComponent size={32} />}
                title={selectedPendiente.titulo}
                badges={
                  <>
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold`}
                      style={{
                        backgroundColor: color + "20",
                        color: color,
                      }}
                    >
                      {formatTipo(selectedPendiente.tipo)}
                    </span>
                    <span>·</span>
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        selectedPendiente.solicitanteRole === "yo"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                      }`}
                    >
                      {selectedPendiente.solicitanteRole === "yo"
                        ? "Pedido por mí"
                        : "Mi responsable"}
                    </span>
                    <span>·</span>
                    <span>{selectedPendiente.solicitante}</span>
                    <span>·</span>
                    <span>{selectedPendiente.sortDate}</span>
                  </>
                }
                action={
                  <button
                    onClick={() => setConfirmFirmaId(selectedPendiente.id)}
                    disabled={firmandoId !== null}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {firmandoId === selectedPendiente.id ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Firmando...
                      </>
                    ) : (
                      <>
                        <PenSquare size={18} />
                        Firmar
                      </>
                    )}
                  </button>
                }
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line mb-4">
                  {selectedPendiente.descripcion}
                </p>
                {selectedPendiente.tipo === "necesidad_formativa" &&
                  selectedPendiente.materia && (
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen size={14} className="text-gray-400 shrink-0" />
                      <span className="text-gray-500 w-[72px] shrink-0">
                        Materia:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {selectedPendiente.materia}
                      </span>
                    </div>
                  )}
                {selectedPendiente.tipo === "recepcion_material" &&
                  selectedPendiente.material && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package size={14} className="text-gray-400 shrink-0" />
                      <span className="text-gray-500 w-[72px] shrink-0">
                        Material:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {selectedPendiente.material}
                      </span>
                    </div>
                  )}
                {selectedPendiente.tipo === "recepcion_material" &&
                  selectedPendiente.cantidad && (
                    <div className="flex items-center gap-2 text-sm">
                      <Package size={14} className="text-gray-400 shrink-0" />
                      <span className="text-gray-500 w-[72px] shrink-0">
                        Cantidad:
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">
                        {selectedPendiente.cantidad} uds.
                      </span>
                    </div>
                  )}
                {selectedPendiente.tipo === "permiso" && (
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarOff size={14} className="text-gray-400 shrink-0" />
                    <span className="text-gray-500 w-[72px] shrink-0">
                      Tipo:
                    </span>
                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                      Permiso formativo
                    </span>
                  </div>
                )}
              </DetailCard>
            );
          })()}
      </PopupOverlay>
    </ScreenLayout>
  );
}
