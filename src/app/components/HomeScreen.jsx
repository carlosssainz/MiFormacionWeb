import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  QrCode,
  Globe,
  BookOpen,
  Pill,
  Search,
  Calendar,
  FileText,
  Link as LinkIcon,
  Clock,
  ClipboardCheck,
  MessageSquare,
  ClipboardList,
  FileCheck,
  Tv,
  PenSquare,
  ArrowRight,
  CheckCircle,
  GripVertical,
} from "lucide-react";
import { ContextualHelp } from "./ContextualHelp";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/slider.css";
import carrusel1 from "../imports/foto (1).jpeg";
import carrusel2 from "../imports/foto (2).jpg";
import carrusel3 from "../imports/foto (3).jpg";
import carrusel4 from "../imports/foto (4).jpg";
import { ScreenLayout } from "./ScreenLayout";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";
import { ENCUESTAS } from "../data/mockData";


function ToolButton({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white rounded-lg flex flex-col items-center justify-center gap-2 transition-colors w-full h-24 ${!onClick ? "opacity-80" : ""}`}
    >
      {icon}
      <span className="text-sm uppercase">{label}</span>
    </button>
  );
}

export function HomeScreen() {
  const { role, acciones, completarAccion } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [helpOpen, setHelpOpen] = useState(false);
  const [selectedAccionHomeId, setSelectedAccionHomeId] = useState(null);
  const [indices, setIndices] = useState({
    servicios: 0,
    plan: 0,
    evaluaciones: 0,
    movilidad: 0,
  });
  const [collapsed, setCollapsed] = useState({});

  const toggleCollapsed = (key) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const pendingAcciones = acciones.filter((a) => a.estado === "pendiente" && (a.tipo !== "mostrar_qr" || role === "formador"));
  const pendingAccionesCount = pendingAcciones.length;
  const encuestasPendientesCount = ENCUESTAS.filter(
    (e) => e.estado === "no-realizado",
  ).length;

  const DEFAULT_ORDER = ["news", "pending-actions", "servicios", "plan", "evaluaciones", "movilidad"];

  const [sectionOrder, setSectionOrder] = useState(() => {
    try {
      const saved = localStorage.getItem("home-sections-order");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.length === DEFAULT_ORDER.length && DEFAULT_ORDER.every((id) => parsed.includes(id))) {
          return parsed;
        }
      }
    } catch {}
    return DEFAULT_ORDER;
  });

  useEffect(() => {
    localStorage.setItem("home-sections-order", JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const dragItem = useRef(null);
  const touchDrag = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  const getSectionIndexFromY = useCallback((clientY) => {
    const entries = Object.entries(sectionRefs.current);
    for (let i = 0; i < entries.length; i++) {
      const el = entries[i][1];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        return sectionOrder.indexOf(entries[i][0]);
      }
    }
    // If outside, return nearest
    let nearest = 0;
    let minDist = Infinity;
    for (let i = 0; i < entries.length; i++) {
      const el = entries[i][1];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const dist = Math.abs(clientY - mid);
      if (dist < minDist) {
        minDist = dist;
        nearest = sectionOrder.indexOf(entries[i][0]);
      }
    }
    return nearest;
  }, [sectionOrder]);

  const handleTouchStart = useCallback((e, index) => {
    const touch = e.touches[0];
    dragItem.current = index;
    touchDrag.current = { index, startY: touch.clientY };
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (dragItem.current === null) return;
    e.preventDefault();
    const touch = e.touches[0];
    const targetIndex = getSectionIndexFromY(touch.clientY);
    if (targetIndex !== -1 && targetIndex !== dragItem.current) {
      setDragOver(targetIndex);
    } else {
      setDragOver(null);
    }
  }, [getSectionIndexFromY]);

  const handleTouchEnd = useCallback(() => {
    if (dragItem.current === null) return;
    if (dragOver !== null && dragOver !== dragItem.current) {
      setSectionOrder((prev) => {
        const next = [...prev];
        const [moved] = next.splice(dragItem.current, 1);
        next.splice(dragOver, 0, moved);
        return next;
      });
    }
    dragItem.current = null;
    touchDrag.current = null;
    setDragOver(null);
  }, [dragOver]);

  const handleDragStart = useCallback((e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index);
  }, []);

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragItem.current !== null && dragItem.current !== index) {
      setDragOver(index);
    }
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(null);
  }, []);

  const handleDrop = useCallback((e, toIndex) => {
    e.preventDefault();
    const fromIndex = dragItem.current;
    if (fromIndex !== null && fromIndex !== toIndex) {
      setSectionOrder((prev) => {
        const next = [...prev];
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    }
    dragItem.current = null;
    setDragOver(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    dragItem.current = null;
    setDragOver(null);
  }, []);

  const TIPO_ICONS = {
    asistencia: QrCode,
    firma: PenSquare,
    encuesta: ClipboardCheck,
    examen: ClipboardList,
    necesidad: FileText,
    mostrar_qr: QrCode,
  };

  const TIPO_COLORS = {
    asistencia: "#6BCB77",
    firma: "#FF8C6B",
    encuesta: "#6BB5FF",
    examen: "#9B8FFF",
    necesidad: "#FFD93D",
    mostrar_qr: "#207041",
  };

  const sections = [
    {
      id: "servicios",
      title: t("home.trainingServices"),
      verTodoPath: "/servicios",
      type: "carousel",
      items: [
        {
          label: t("home.upcomingCourses"),
          icon: <Calendar size={28} />,
          path: "/cursos?tab=proximos",
        },
        { label: t("home.pills"), icon: <Pill size={28} />, path: "/pildoras" },
        {
          label: t("home.trainingTV"),
          icon: <Tv size={28} />,
          path: "/canales",
        },
        {
          label: t("home.catalog"),
          icon: <Search size={28} />,
          path: "/cursos?tab=catalogo",
        },
        {
          label: t("home.portals"),
          icon: <Globe size={28} />,
          path: "/mis-portales",
        },
        { label: t("home.docs"), icon: <FileText size={28} />, path: "/docs" },
        {
          label: t("home.links"),
          icon: <LinkIcon size={28} />,
          path: "/links",
        },
      ],
    },
    {
      id: "plan",
      title: t("home.myPlan"),
      verTodoPath: "/captura-necesidades",
      type: "grid",
      items: [
        {
          label: t("home.currentYear"),
          icon: <Calendar size={28} />,
          path: "/captura-necesidades",
        },
        {
          label: t("home.nextYear"),
          icon: <Clock size={28} />,
          path: "/captura-necesidades?year=proximo",
        },
        {
          label: t("home.request"),
          icon: <FileText size={28} />,
          path: "/captura-necesidades?solicitar=true",
        },
      ],
    },
    {
      id: "evaluaciones",
      title: t("home.myEvaluations"),
      verTodoPath: "/evaluaciones",
      type: "grid",
      items: [
        {
          label: t("home.surveys"),
          icon: <ClipboardCheck size={28} />,
          path: "/encuestas",
        },
        {
          label: t("home.suggestions"),
          icon: <MessageSquare size={28} />,
          path: "/sugerencias",
        },
      ],
    },
    {
      id: "movilidad",
      title: t("home.myMobility"),
      verTodoPath: "/movilidad",
      type: "carousel",
      items: [
        {
          label: t("home.requests"),
          icon: <FileText size={28} />,
          path: "/movilidad-solicitudes",
        },
        {
          label: t("home.examsUpcoming"),
          icon: <ClipboardList size={28} />,
          path: "/examenes-previstos",
        },
        {
          label: t("home.examsInProgress"),
          icon: <FileText size={28} />,
          path: "/examenes-proceso",
        },
        {
          label: t("home.examsCompleted"),
          icon: <FileCheck size={28} />,
          path: "/examenes-realizados",
        },
        {
          label: t("home.syllabus"),
          icon: <BookOpen size={28} />,
          path: "/temarios",
        },
      ],
    },
  ];

  const newsSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const sectionRefs = useRef({});

  function renderSectionById(sectionId, index) {
    const isOver = dragOver === index;
    const baseClasses = "bg-white dark:bg-gray-800 px-4 py-3 mb-2 transition-opacity duration-200";
    const dragClasses = isOver ? "opacity-50 ring-2 ring-[#659B35] dark:ring-[#85C34A] rounded-xl" : "";

    switch (sectionId) {
      case "news":
        return (
          <div
            key="news"
            ref={(el) => (sectionRefs.current.news = el)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`${baseClasses} ${dragClasses}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical size={16} className="text-gray-300 dark:text-gray-600 shrink-0 cursor-grab active:cursor-grabbing" />
                <h2 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {t("home.newsTitle")}
                </h2>
              </div>
              <button
                onClick={() => navigate("/noticias")}
                className="text-[#659B35] dark:text-[#85C34A] text-sm flex items-center gap-1 hover:text-[#207041] dark:hover:text-[#006633] transition-colors"
              >
                {t("home.viewAll")}
                <ChevronRight size={16} />
              </button>
            </div>
            <Slider {...newsSliderSettings} className="news-slider">
              <div>
                <button
                  onClick={() =>
                    navigate("/noticias", {
                      state: { openNoticiaId: 1, fromInicio: true },
                    })
                  }
                  className="relative rounded-lg overflow-hidden h-32 bg-gray-200 w-full text-left"
                >
                  <img
                    src={carrusel1}
                    alt={t("home.news1Title")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <div className="text-white text-sm font-medium">{t("home.news1Title")}</div>
                  </div>
                </button>
              </div>
              <div>
                <button
                  onClick={() =>
                    navigate("/noticias", {
                      state: { openNoticiaId: 2, fromInicio: true },
                    })
                  }
                  className="relative rounded-lg overflow-hidden h-32 bg-gray-200 w-full text-left"
                >
                  <img
                    src={carrusel2}
                    alt={t("home.news2Title")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <div className="text-white text-sm font-medium">{t("home.news2Title")}</div>
                  </div>
                </button>
              </div>
              <div>
                <button
                  onClick={() =>
                    navigate("/noticias", {
                      state: { openNoticiaId: 3, fromInicio: true },
                    })
                  }
                  className="relative rounded-lg overflow-hidden h-32 bg-gray-200 w-full text-left"
                >
                  <img
                    src={carrusel3}
                    alt={t("home.news3Title")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <div className="text-white text-sm font-medium">{t("home.news3Title")}</div>
                  </div>
                </button>
              </div>
              <div>
                <button
                  onClick={() =>
                    navigate("/noticias", {
                      state: { openNoticiaId: 4, fromInicio: true },
                    })
                  }
                  className="relative rounded-lg overflow-hidden h-32 bg-gray-200 w-full text-left"
                >
                  <img
                    src={carrusel4}
                    alt={t("home.news4Title")}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                    <div className="text-white text-sm font-medium">{t("home.news4Title")}</div>
                  </div>
                </button>
              </div>
            </Slider>
          </div>
        );

      case "pending-actions":
        return (
          <div
            key="pending-actions"
            ref={(el) => (sectionRefs.current["pending-actions"] = el)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`${baseClasses} ${dragClasses}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical size={16} className="text-gray-300 dark:text-gray-600 shrink-0 cursor-grab active:cursor-grabbing" />
                <button
                  onClick={() => toggleCollapsed("pending-actions")}
                  className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-semibold"
                >
                  {t("home.pendingActions")}
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${collapsed["pending-actions"] ? "-rotate-90" : "rotate-0"}`}
                />
              </button>
              </div>
              {pendingAcciones.length > 0 && (
                <button
                  onClick={() => navigate("/acciones")}
                  className="text-[#659B35] dark:text-[#85C34A] text-sm flex items-center gap-1 hover:text-[#207041] dark:hover:text-[#006633]"
                >
                  Ver todas
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
            {!collapsed["pending-actions"] && (
              <>
                {pendingAcciones.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
                    <CheckCircle size={32} className="text-[#659B35]" />
                    <p className="text-sm font-medium">No tienes acciones pendientes</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pendingAcciones.slice(0, 3).map((accion) => {
                      const IconComponent = TIPO_ICONS[accion.tipo] || QrCode;
                      const color = TIPO_COLORS[accion.tipo] || "#207041";
                      return (
                        <button
                          key={accion.id}
                          onClick={() => setSelectedAccionHomeId(accion.id)}
                          className="w-full flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-3 transition-colors text-left"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                            style={{ backgroundColor: color }}
                          >
                            <IconComponent size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                              {accion.titulo}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {accion.descripcion}
                            </p>
                          </div>
                          <span className="shrink-0 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Clock size={10} />
                            Pendiente
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        );

      default: {
        const section = sections.find((s) => s.id === sectionId);
        if (!section) return null;
        const key = sectionId;
        const count = section.items.length;
        const currentIndex = indices[key] ?? 0;
        const isCollapsed = collapsed[key] ?? false;

        return (
          <div
            key={key}
            ref={(el) => (sectionRefs.current[key] = el)}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`${baseClasses} ${dragClasses}`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical size={16} className="text-gray-300 dark:text-gray-600 shrink-0 cursor-grab active:cursor-grabbing" />
                <button
                  onClick={() => toggleCollapsed(key)}
                  className="flex items-center gap-2 text-gray-800 dark:text-gray-100 font-semibold"
                >
                  {section.title}
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-300 ${isCollapsed ? "-rotate-90" : "rotate-0"}`}
                />
              </button>
              </div>
              {section.verTodoPath !== "/evaluaciones" && (
                <button
                  onClick={() => navigate(section.verTodoPath)}
                  className="text-[#659B35] dark:text-[#85C34A] text-sm flex items-center gap-1 hover:text-[#207041] dark:hover:text-[#006633]"
                >
                  {section.verTodoPath === "/captura-necesidades"
                    ? t("home.captureNeeds")
                    : t("home.viewMore")}
                  <ChevronRight size={16} />
                </button>
              )}
            </div>
            {!isCollapsed &&
              (section.type === "carousel" ? (
                <>
                  <Slider {...toolSliderSettings(key, count)} className="tools-slider">
                    {section.items.map((item, i) => (
                      <div key={i} className="px-1">
                        <ToolButton
                          icon={item.icon}
                          label={item.label}
                          onClick={() => navigate(item.path)}
                        />
                      </div>
                    ))}
                  </Slider>
                  <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-[#659B35] dark:bg-[#85C34A] rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${(currentIndex / Math.max(count - 1, 1)) * 100}%` }}
                    />
                  </div>
                </>
              ) : section.verTodoPath === "/captura-necesidades" ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  {section.items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-4 bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] rounded-xl p-4 transition-all text-left flex-1 group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0">
                        {item.icon}
                      </div>
                      <span className="font-semibold text-white text-sm flex-1">
                        {item.label}
                      </span>
                      <ChevronRight
                        size={18}
                        className="text-white/70 group-hover:translate-x-1 transition-transform shrink-0"
                      />
                    </button>
                  ))}
                </div>
              ) : section.verTodoPath === "/evaluaciones" ? (
                <div className="grid grid-cols-2 gap-2">
                  {section.items.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => navigate(item.path)}
                      className="bg-white hover:bg-green-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-2 border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] rounded-xl flex flex-col items-center justify-center gap-2 transition-colors h-24"
                    >
                      <div className="relative">
                        {item.icon}
                        {item.path === "/encuestas" && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                            {encuestasPendientesCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm uppercase">{item.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {section.items.map((item, i) => (
                    <ToolButton
                      key={i}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => navigate(item.path)}
                    />
                  ))}
                </div>
              ))}
          </div>
        );
      }
    }
  }

  const toolSliderSettings = (sectionKey, count) => ({
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 6000,
    swipeToSlide: true,
    afterChange: (current) =>
      setIndices((prev) => ({ ...prev, [sectionKey]: current % count })),
  });

  const selectedAccionFromHome =
    selectedAccionHomeId !== null
      ? acciones.find((a) => a.id === selectedAccionHomeId)
      : null;

  return (
    <ScreenLayout
      headerMode="top"
      onHelpClick={() => setHelpOpen(true)}
    >
      {sectionOrder.map((sectionId, index) => renderSectionById(sectionId, index))}

      <PopupOverlay
        open={!!selectedAccionFromHome}
        onClose={() => setSelectedAccionHomeId(null)}
      >
        {selectedAccionFromHome &&
          (() => {
            const IconComponent = TIPO_ICONS[selectedAccionFromHome.tipo] || QrCode;
            const color = TIPO_COLORS[selectedAccionFromHome.tipo] || "#207041";
            return (
              <DetailCard
                color={color}
                icon={<IconComponent size={32} />}
                title={selectedAccionFromHome.titulo}
                badges={
                  <>
                    <span
                      className="px-2 py-0.5 rounded-full font-semibold text-xs"
                      style={{
                        backgroundColor: color + "20",
                        color: color,
                      }}
                    >
                      {selectedAccionFromHome.tipo}
                    </span>
                    <span>·</span>
                    <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 text-xs">
                      <Clock size={10} />
                      Pendiente
                    </span>
                    <span>·</span>
                    <span className="text-xs">
                      {new Date(selectedAccionFromHome.fechaCreacion).toLocaleDateString("es-ES", {
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
                      if (selectedAccionFromHome.enlace) {
                        navigate(selectedAccionFromHome.enlace, selectedAccionFromHome.targetId ? { state: { openPendienteId: selectedAccionFromHome.targetId } } : undefined);
                        if (selectedAccionFromHome.tipo === "mostrar_qr") {
                          completarAccion(selectedAccionFromHome.id);
                        }
                        setSelectedAccionHomeId(null);
                      } else {
                        completarAccion(selectedAccionFromHome.id);
                        setSelectedAccionHomeId(null);
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
                  {selectedAccionFromHome.descripcion}
                </p>
              </DetailCard>
            );
          })()}
      </PopupOverlay>

      <ContextualHelp
        helpKey="home"
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </ScreenLayout>
  );
}
