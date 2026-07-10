import { useState } from "react";
import { useI18n } from "../context/I18nContext";
import { useParams, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  MapPin,
  User,
  Clock,
  HardHat,
  Monitor,
  Wrench,
  Radio,
  FileText,
  Download,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  ExternalLink,
  Mail,
  Folder,
  FolderOpen,
  X,
} from "lucide-react";
import { CURSOS_DATA, CURSOS_DETALLE } from "../data/mockData";
import { ScreenLayout } from "./ScreenLayout";

function CourseIcon({ icon, size = 24 }) {
  const icons = {
    helmet: <HardHat size={size} />,
    screen: <Monitor size={size} />,
    tools: <Wrench size={size} />,
    signal: <Radio size={size} />,
  };
  return <>{icons[icon] ?? <BookOpen size={size} />}</>;
}

function InfoSection({ icon: Icon, title, children }) {
  return (
    <div className="mx-4 mb-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <Icon size={16} className="text-[#659B35]" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">
        {children}
      </div>
    </div>
  );
}

function getTemarioTree(cursoId) {
  const trees = {
    1: [
      { name: "Bienvenida y objetivos del curso", type: "file" },
      {
        name: "Marco normativo de seguridad vial ferroviaria",
        type: "folder",
        children: [
          {
            name: "Marco normativo de seguridad vial ferroviaria",
            type: "file",
          },
          { name: "Autoevaluación. Marco normativo", type: "file" },
        ],
      },
      {
        name: "Identificación de riesgos en el entorno ferroviario",
        type: "folder",
        children: [
          {
            name: "Identificación de riesgos en el entorno ferroviario",
            type: "file",
          },
          { name: "Autoevaluación. Identificación de riesgos", type: "file" },
          { name: "Ejercicio práctico: Mapa de riesgos", type: "file" },
        ],
      },
      {
        name: "Medidas preventivas y equipos de protección",
        type: "folder",
        children: [
          { name: "Medidas preventivas y equipos de protección", type: "file" },
          { name: "Autoevaluación. EPIs", type: "file" },
        ],
      },
      {
        name: "Actuación ante accidentes ferroviarios",
        type: "folder",
        children: [
          { name: "Protocolo de actuación ante accidentes", type: "file" },
          { name: "Autoevaluación. Actuación ante accidentes", type: "file" },
          { name: "Foro: Casos reales de accidentes", type: "file" },
        ],
      },
      { name: "Evaluación final", type: "file" },
    ],
    2: [
      { name: "Presentación del curso", type: "file" },
      {
        name: "Fundamentos de señalización ferroviaria",
        type: "folder",
        children: [
          { name: "Introducción a la señalización digital", type: "file" },
          { name: "Autoevaluación. Fundamentos", type: "file" },
        ],
      },
      {
        name: "Tecnología ERTMS y ETCS",
        type: "folder",
        children: [
          { name: "Sistema ERTMS Nivel 2", type: "file" },
          { name: "Componentes y arquitectura ETCS", type: "file" },
          { name: "Autoevaluación. ERTMS", type: "file" },
        ],
      },
      {
        name: "Sistemas de bloqueo y enclavamiento",
        type: "folder",
        children: [
          { name: "Sistemas de bloqueo y enclavamiento", type: "file" },
          { name: "Autoevaluación. Bloqueos", type: "file" },
          {
            name: "Ejercicio de tutoría: Simulación de enclavamiento",
            type: "file",
          },
        ],
      },
      {
        name: "Mantenimiento de sistemas de señalización",
        type: "folder",
        children: [
          { name: "Mantenimiento preventivo de señalización", type: "file" },
          { name: "Autoevaluación. Mantenimiento", type: "file" },
        ],
      },
      { name: "Examen final", type: "file" },
    ],
    5: [
      { name: "Introducción a la gestión de emergencias", type: "file" },
      {
        name: "Protocolos de emergencia ferroviaria",
        type: "folder",
        children: [
          { name: "Protocolos de emergencia ferroviaria", type: "file" },
          { name: "Autoevaluación. Protocolos", type: "file" },
        ],
      },
      {
        name: "Evacuación y comunicación en emergencias",
        type: "folder",
        children: [
          { name: "Procedimientos de evacuación", type: "file" },
          { name: "Sistemas de comunicación de emergencia", type: "file" },
          { name: "Autoevaluación. Evacuación", type: "file" },
        ],
      },
      {
        name: "Coordinación con servicios de emergencia",
        type: "folder",
        children: [
          {
            name: "Coordinación con bomberos y servicios sanitarios",
            type: "file",
          },
          { name: "Autoevaluación. Coordinación", type: "file" },
          { name: "Foro: Simulación de emergencia", type: "file" },
        ],
      },
      { name: "Ejercicio final: Plan de emergencia", type: "file" },
    ],
    9: [
      { name: "Bienvenida", type: "file" },
      {
        name: "Nuevas tecnologías en señalización",
        type: "folder",
        children: [
          { name: "Innovaciones en señalización ferroviaria", type: "file" },
          { name: "Autoevaluación. Innovaciones", type: "file" },
        ],
      },
      {
        name: "Digitalización de sistemas de control",
        type: "folder",
        children: [
          { name: "Digitalización de sistemas de control", type: "file" },
          { name: "Autoevaluación. Digitalización", type: "file" },
          {
            name: "Ejercicio de Foro: Debate sobre digitalización",
            type: "file",
          },
        ],
      },
      {
        name: "Integración de sistemas IoT en señalización",
        type: "folder",
        children: [
          { name: "IoT aplicado a la señalización ferroviaria", type: "file" },
          { name: "Autoevaluación. IoT", type: "file" },
        ],
      },
      { name: "Trabajo final: Proyecto de innovación", type: "file" },
    ],
    10: [
      { name: "Objetivos y normativa de seguridad en altura", type: "file" },
      {
        name: "Equipos de protección contra caídas",
        type: "folder",
        children: [
          { name: "EPIs para trabajos en altura", type: "file" },
          { name: "Inspección y mantenimiento de EPIs", type: "file" },
          { name: "Autoevaluación. EPIs altura", type: "file" },
        ],
      },
      {
        name: "Técnicas de acceso y posicionamiento",
        type: "folder",
        children: [
          { name: "Técnicas de acceso mediante cuerdas", type: "file" },
          { name: "Autoevaluación. Técnicas de acceso", type: "file" },
          {
            name: "Ejercicio de tutoría: Montaje de línea de vida",
            type: "file",
          },
        ],
      },
      {
        name: "Trabajos en instalaciones ferroviarias en altura",
        type: "folder",
        children: [
          { name: "Trabajos en catenaria y estructuras", type: "file" },
          { name: "Autoevaluación. Instalaciones", type: "file" },
        ],
      },
      { name: "Evaluación práctica final", type: "file" },
    ],
    11: [
      { name: "Presentación del curso", type: "file" },
      {
        name: "Características de las líneas de alta velocidad",
        type: "folder",
        children: [
          { name: "Infraestructura de alta velocidad", type: "file" },
          { name: "Autoevaluación. Infraestructura AV", type: "file" },
        ],
      },
      {
        name: "Conducción en líneas de alta velocidad",
        type: "folder",
        children: [
          { name: "Técnicas de conducción en AV", type: "file" },
          { name: "Sistemas de ayuda a la conducción", type: "file" },
          { name: "Autoevaluación. Conducción AV", type: "file" },
          { name: "Ejercicio de Foro: Experiencias en AV", type: "file" },
        ],
      },
      {
        name: "Seguridad en la conducción de alta velocidad",
        type: "folder",
        children: [
          { name: "Protocolos de seguridad en AV", type: "file" },
          { name: "Autoevaluación. Seguridad AV", type: "file" },
        ],
      },
      { name: "Simulacro de conducción", type: "file" },
    ],
    12: [
      { name: "Introducción a la inspección de puentes", type: "file" },
      {
        name: "Tipología de puentes ferroviarios",
        type: "folder",
        children: [
          { name: "Tipos de puentes y estructuras", type: "file" },
          { name: "Autoevaluación. Tipología", type: "file" },
        ],
      },
      {
        name: "Técnicas de inspección",
        type: "folder",
        children: [
          { name: "Inspección visual y instrumental", type: "file" },
          { name: "Ensayos no destructivos", type: "file" },
          { name: "Autoevaluación. Técnicas de inspección", type: "file" },
          { name: "Ejercicio de tutoría: Inspección de puente", type: "file" },
        ],
      },
      {
        name: "Mantenimiento y reparación",
        type: "folder",
        children: [
          { name: "Mantenimiento preventivo de puentes", type: "file" },
          { name: "Técnicas de reparación estructural", type: "file" },
          { name: "Autoevaluación. Mantenimiento", type: "file" },
        ],
      },
      { name: "Caso práctico: Informe de inspección", type: "file" },
    ],
    13: [
      { name: "Bienvenida y contextualización", type: "file" },
      {
        name: "Fundamentos de protección de datos",
        type: "folder",
        children: [
          { name: "Reglamento General de Protección de Datos", type: "file" },
          { name: "Autoevaluación. RGPD", type: "file" },
        ],
      },
      {
        name: "Ciberseguridad en entornos ferroviarios",
        type: "folder",
        children: [
          {
            name: "Amenazas y vulnerabilidades en sistemas ferroviarios",
            type: "file",
          },
          { name: "Medidas de ciberseguridad", type: "file" },
          { name: "Autoevaluación. Ciberseguridad", type: "file" },
        ],
      },
      {
        name: "Gestión de incidentes de seguridad",
        type: "folder",
        children: [
          { name: "Protocolo de actuación ante incidentes", type: "file" },
          { name: "Autoevaluación. Incidentes", type: "file" },
          { name: "Foro: Casos de ciberataques", type: "file" },
        ],
      },
      { name: "Evaluación final", type: "file" },
    ],
    14: [
      { name: "Objetivos del taller", type: "file" },
      {
        name: "Fundamentos de la comunicación efectiva",
        type: "folder",
        children: [
          { name: "Comunicación verbal y no verbal", type: "file" },
          { name: "Autoevaluación. Comunicación", type: "file" },
        ],
      },
      {
        name: "Trabajo en equipo y colaboración",
        type: "folder",
        children: [
          { name: "Dinámicas de grupo", type: "file" },
          { name: "Resolución de conflictos", type: "file" },
          { name: "Autoevaluación. Trabajo en equipo", type: "file" },
          { name: "Ejercicio de tutoría: Role playing", type: "file" },
        ],
      },
      {
        name: "Liderazgo y motivación",
        type: "folder",
        children: [
          { name: "Estilos de liderazgo", type: "file" },
          { name: "Autoevaluación. Liderazgo", type: "file" },
        ],
      },
      { name: "Proyecto final: Plan de mejora de equipo", type: "file" },
    ],
  };

  return (
    trees[cursoId] ?? [
      { name: "Bienvenida", type: "file" },
      {
        name: "Módulo 1: Contenido teórico",
        type: "folder",
        children: [
          { name: "Unidad 1: Introducción", type: "file" },
          { name: "Unidad 2: Desarrollo", type: "file" },
          { name: "Autoevaluación. Módulo 1", type: "file" },
        ],
      },
      {
        name: "Módulo 2: Contenido práctico",
        type: "folder",
        children: [
          { name: "Unidad 3: Aplicación práctica", type: "file" },
          { name: "Autoevaluación. Módulo 2", type: "file" },
        ],
      },
      {
        name: "Módulo 3: Evaluación",
        type: "folder",
        children: [
          { name: "Ejercicio final", type: "file" },
          { name: "Examen", type: "file" },
        ],
      },
    ]
  );
}

function TreeItem({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === "folder";

  return (
    <div>
      <button
        onClick={() => isFolder && setExpanded(!expanded)}
        className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${depth === 0 ? "font-semibold text-gray-800 dark:text-gray-100" : "text-gray-700 dark:text-gray-300"}`}
        style={{ paddingLeft: `${12 + depth * 20}px` }}
      >
        {isFolder ? (
          expanded ? (
            <FolderOpen size={16} className="text-[#E3A71D] shrink-0" />
          ) : (
            <Folder size={16} className="text-[#E3A71D] shrink-0" />
          )
        ) : (
          <FileText size={14} className="text-gray-400 shrink-0" />
        )}
        <span className="text-xs leading-relaxed flex-1">{node.name}</span>
        {isFolder &&
          (expanded ? (
            <ChevronDown size={14} className="text-gray-400 shrink-0" />
          ) : (
            <ChevronRight size={14} className="text-gray-400 shrink-0" />
          ))}
      </button>
      {isFolder &&
        expanded &&
        node.children?.map((child, i) => (
          <TreeItem key={i} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

function InfoField({ label, value }) {
  return (
    <div className="flex items-start px-4 py-2.5 gap-2">
      <span className="text-[11px] text-gray-400 dark:text-gray-500 w-24 flex-shrink-0">
        {label}
      </span>
      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium flex-1">
        {value}
      </span>
    </div>
  );
}

export function CursoDetalleScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();

  const cursoId = Number(id);
  const curso = CURSOS_DATA.find((c) => c.id === cursoId);
  const detalle = CURSOS_DETALLE[cursoId];

  if (!curso || !detalle) {
    return (
      <ScreenLayout
        headerMode="back"
        backTitle={t("courseDetail.notFound")}
        helpKey="curso-detalle"
      >
        <div className="flex flex-col items-center justify-center py-16 text-gray-400">
          <p className="text-sm">{t("courseDetail.notFound")}</p>
        </div>
      </ScreenLayout>
    );
  }

  const [temarioOpen, setTemarioOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [confirmCancel, setConfirmCancel] = useState(false);

  const gestorEmail = `${detalle.gestor
    .toLowerCase()
    .replace(/\s+/g, ".")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")}@adif.es`;

  const modulesTotal = 5;
  const modulesDone = Math.min(
    Math.round(curso.progress / (100 / modulesTotal)),
    modulesTotal,
  );

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={curso.title}
      helpKey="curso-detalle"
    >
      <div className="pb-6">
        <div className="bg-gradient-to-br from-[#659B35] to-[#207041] p-5 text-white">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center flex-shrink-0">
              <CourseIcon icon={curso.icon} size={24} />
            </div>
            <h1 className="font-bold text-base leading-tight pt-1">
              {curso.title}
            </h1>
          </div>

          {curso.progress > 0 && (
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-white/80">
                  {t("courseDetail.progress")}
                </span>
                <span className="text-xs font-bold">{curso.progress}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white/70 rounded-full transition-all"
                  style={{ width: `${curso.progress}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                curso.status === "realizado"
                  ? "bg-green-400/30 text-green-100"
                  : curso.status === "en-proceso"
                    ? "bg-blue-400/30 text-blue-100"
                    : "bg-amber-400/30 text-amber-100"
              }`}
            >
              {curso.status === "en-proceso"
                ? t("courseDetail.inProgress")
                : curso.status === "realizado"
                  ? t("courseDetail.completed")
                  : t("courseDetail.upcoming")}
            </span>
            <span className="text-xs text-white/70">{curso.modality}</span>
            {curso.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-white/10 rounded text-[10px]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 px-4 -mt-4 mb-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm text-center">
            <Clock size={16} className="mx-auto mb-1 text-[#659B35]" />
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
              {detalle.duracion}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {t("courseDetail.duration")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm text-center">
            <Calendar size={16} className="mx-auto mb-1 text-[#659B35]" />
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
              {t("courseDetail.days").replace("{count}", detalle.dias)}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {t("courseDetail.sessions")}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm text-center">
            <BookOpen size={16} className="mx-auto mb-1 text-[#659B35]" />
            <p className="text-xs font-bold text-gray-800 dark:text-gray-100">
              {detalle.modalidad}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              {t("courseDetail.modality")}
            </p>
          </div>
        </div>

        {curso.progress > 0 && (
          <div className="mx-4 mb-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border-l-4 border-gray-200 dark:border-gray-600">
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-3">
              {t("courseDetail.myProgress")}
            </h2>
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>{t("courseDetail.completedLabel")}</span>
                <span className="font-semibold text-[#207041]">
                  {curso.progress}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#659B35] to-[#207041] rounded-full transition-all"
                  style={{ width: `${curso.progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <CheckCircle size={14} className="text-[#659B35] flex-shrink-0" />
              <span>
                {t("courseDetail.modulesCompleted")
                  .replace("{done}", modulesDone)
                  .replace("{total}", modulesTotal)}
              </span>
            </div>
            {curso.status === "en-proceso" && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                <Clock size={14} className="text-amber-500 flex-shrink-0" />
                <span>
                  {t("courseDetail.nextSession")
                    .replace("{date}", detalle.fechaInicio)
                    .replace("{time}", detalle.horaInicio)}
                </span>
              </div>
            )}
            {curso.status === "realizado" && (
              <div className="mt-2 flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                <CheckCircle size={14} className="flex-shrink-0" />
                <span>
                  {t("courseDetail.courseCompleted").replace(
                    "{date}",
                    detalle.fechaFin,
                  )}
                </span>
              </div>
            )}
            <button
              onClick={() =>
                window.open(
                  "https://cfv.adif.es",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
              className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#659B35] text-[#659B35] hover:bg-[#659B35] hover:text-white font-semibold text-sm transition-colors"
            >
              {t("courseDetail.accessCourse")} <ExternalLink size={16} />
            </button>
            {curso.progress > 80 && (
              <button
                onClick={() => {
                  const name = `CERTIFICADO_${curso.title.replace(/\s+/g, "_")}.pdf`;
                  const blob = new Blob(
                    [`Certificado de finalización del curso: ${curso.title}`],
                    { type: "application/pdf" },
                  );
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = name;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold text-sm transition-colors"
              >
                <Download size={16} /> {t("courseDetail.downloadCert")}
              </button>
            )}
          </div>
        )}

        <InfoSection icon={BookOpen} title={t("courseDetail.courseData")}>
          <InfoField
            label={t("courseDetail.idCatalog")}
            value={detalle.idTipoActo}
          />
          <InfoField
            label={t("courseDetail.idCourse")}
            value={`${detalle.idActo} (${detalle.idActoStatus})`}
          />
          <InfoField
            label={t("courseDetail.subject")}
            value={detalle.materia}
          />
          <InfoField label={t("courseDetail.type")} value={curso.type} />
          <InfoField
            label={t("courseDetail.baseCourse")}
            value={detalle.cursoBase}
          />
          <InfoField
            label={t("courseDetail.specificCourse")}
            value={detalle.cursoEspecifico}
          />
        </InfoSection>

        <InfoSection icon={Calendar} title={t("courseDetail.calendar")}>
          <InfoField
            label={t("courseDetail.start")}
            value={detalle.fechaInicio}
          />
          <InfoField label={t("courseDetail.end")} value={detalle.fechaFin} />
          <InfoField
            label={t("courseDetail.schedule")}
            value={detalle.horaInicio}
          />
          <InfoField
            label={t("courseDetail.duration")}
            value={detalle.duracion}
          />
          <InfoField
            label={t("courseDetail.sessions")}
            value={`${t("courseDetail.days").replace("{count}", detalle.dias)}`}
          />
          <InfoField
            label={t("courseDetail.inPerson")}
            value={detalle.presenciales}
          />
          <InfoField label={t("courseDetail.theory")} value={detalle.teoria} />
          <InfoField
            label={t("courseDetail.publishDate")}
            value={detalle.fechaPublicacion}
          />
        </InfoSection>

        <InfoSection icon={MapPin} title={t("courseDetail.location")}>
          <InfoField label={t("courseDetail.center")} value={curso.center} />
          <InfoField
            label={t("courseDetail.province")}
            value={detalle.provincia}
          />
          <InfoField label={t("courseDetail.place")} value={detalle.lugar} />
          <InfoField label={t("courseDetail.classroom")} value={detalle.aula} />
        </InfoSection>

        <InfoSection icon={User} title={t("courseDetail.management")}>
          <InfoField label={t("courseDetail.manager")} value={detalle.gestor} />
          <InfoField
            label={t("courseDetail.quality")}
            value={detalle.indiceCalidad}
          />
          <InfoField
            label={t("courseDetail.expenses")}
            value={detalle.gastos}
          />
          <InfoField
            label={t("courseDetail.observations")}
            value={detalle.observacionesInternas}
          />
        </InfoSection>

        <div className="px-4 space-y-2 mt-6">
          <button
            onClick={() => {
              setContactModalOpen(true);
              setMensaje("");
              setConfirmCancel(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-9 h-9 bg-[#F5F5F5] dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Mail size={18} className="text-[#659B35]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("courseDetail.contactTrainer")}
              </p>
              <p className="text-xs text-gray-400 truncate">{detalle.gestor}</p>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0" />
          </button>

          <button
            onClick={() => setTemarioOpen(!temarioOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-9 h-9 bg-[#F5F5F5] dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Folder size={18} className="text-[#659B35]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("courseDetail.viewSyllabus")}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {t("courseDetail.courseFiles")}
              </p>
            </div>
            {temarioOpen ? (
              <ChevronDown size={16} className="text-gray-400 shrink-0" />
            ) : (
              <ChevronRight size={16} className="text-gray-400 shrink-0" />
            )}
          </button>

          {temarioOpen && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              {getTemarioTree(cursoId).map((node, i) => (
                <TreeItem key={i} node={node} depth={0} />
              ))}
            </div>
          )}

          <button
            onClick={() => {
              const name = `GUIA_${curso.title.replace(/\s+/g, "_")}.pdf`;
              const blob = new Blob(
                [t("courseDetail.guidePrefix") + curso.title],
                { type: "application/pdf" },
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = name;
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-9 h-9 bg-[#F5F5F5] dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Download size={18} className="text-[#659B35]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t("courseDetail.downloadGuide")}
              </p>
              <p className="text-xs text-gray-400 truncate">
                PDF · {`GUIA_${curso.title.replace(/\s+/g, "_")}.pdf`}
              </p>
            </div>
            <Download size={16} className="text-gray-400 shrink-0" />
          </button>
        </div>

        {contactModalOpen && !confirmCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {t("courseDetail.contactModalTitle")}
                </h3>
                <button
                  onClick={() => {
                    if (mensaje.trim()) setConfirmCancel(true);
                    else setContactModalOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
                  {t("courseDetail.to")}
                </label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200">
                  <Mail size={14} className="text-gray-400 shrink-0" />
                  <span className="truncate">{gestorEmail}</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
                  {t("courseDetail.subject2")}
                </label>
                <div className="px-3 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 truncate">
                  {t("courseDetail.contactSubject").replace(
                    "{title}",
                    curso.title,
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 block">
                  {t("courseDetail.message")}
                </label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder={t("courseDetail.messagePlaceholder")}
                  rows={5}
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#E3EB7A]"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (mensaje.trim()) setConfirmCancel(true);
                    else setContactModalOpen(false);
                  }}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t("courseDetail.cancel")}
                </button>
                <button
                  disabled={!mensaje.trim()}
                  onClick={() => {
                    setContactModalOpen(false);
                    setMensaje("");
                  }}
                  className={`flex-1 py-2.5 font-semibold text-sm rounded-xl transition-colors ${
                    mensaje.trim()
                      ? "bg-[#659B35] dark:bg-[#85C34A] text-white hover:bg-[#207041] dark:hover:bg-[#006633]"
                      : "bg-gray-200 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {t("courseDetail.send")}
                </button>
              </div>
            </div>
          </div>
        )}

        {contactModalOpen && confirmCancel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-xl">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
                {t("courseDetail.exitWithoutSending")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
                {t("courseDetail.exitConfirm")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setContactModalOpen(false);
                    setMensaje("");
                    setConfirmCancel(false);
                  }}
                  className="flex-1 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold text-sm rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  {t("courseDetail.delete")}
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-sm rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  {t("courseDetail.keepEditing")}
                </button>
              </div>
              <button
                onClick={() => {
                  setContactModalOpen(false);
                  setConfirmCancel(false);
                }}
                className="w-full mt-2 py-2.5 text-gray-500 dark:text-gray-400 font-medium text-sm rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                {t("courseDetail.saveDraft")}
              </button>
            </div>
          </div>
        )}
      </div>
    </ScreenLayout>
  );
}
