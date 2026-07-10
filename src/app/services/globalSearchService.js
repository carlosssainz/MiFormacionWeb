import {
  CURSOS_DATA,
  DOCUMENTOS,
  PILDORAS,
  LINKS,
  ALL_NOTICIAS,
  AGENDA_EVENTS,
  EXAMENES,
  EXAMENES_PREVISTOS,
  EXAMENES_REALIZADOS,
  EVENTOS_JORNADAS,
  PROGRAMAS,
  TEMARIOS,
  HABILITACIONES,
  NECESIDADES,
  SUGERENCIAS,
  ACCIONES,
} from "../data/mockData";

function q(text, query) {
  return text.toLowerCase().includes(query);
}

const TYPE_CONFIG = {
  curso: { label: "Cursos", icon: "book" },
  noticia: { label: "Noticias", icon: "news" },
  documento: { label: "Documentos", icon: "file" },
  pildora: { label: "Píldoras", icon: "pill" },
  link: { label: "Links", icon: "link" },
  agenda: { label: "Agenda", icon: "calendar" },
  examen: { label: "Exámenes", icon: "clipboard" },
  evento: { label: "Eventos / Jornadas", icon: "calendar" },
  programa: { label: "Programas", icon: "award" },
  temario: { label: "Temarios", icon: "book" },
  habilitacion: { label: "Habilitaciones", icon: "shield" },
  necesidad: { label: "Necesidades Formativas", icon: "clipboard" },
  sugerencia: { label: "Sugerencias", icon: "message" },
  boton: { label: "Accesos Rápidos", icon: "zap" },
  accion: { label: "Acciones Pendientes", icon: "clipboard" },
};



const BUTTONS = [
  { route: "/qr-scanner", title: "Firmar Asistencia", desc: "Registrar asistencia a curso mediante código QR" },
  { route: "/qr-generator", title: "Generar QR Asistencia", desc: "Generar código QR para que los alumnos firmen" },
  { route: "/documentos", title: "Documentos", desc: "Gestionar documentos y solicitudes pendientes de firmar" },
  { route: "/acciones", title: "Acciones Pendientes", desc: "Tareas pendientes que requieren tu atención" },
  { route: "/cursos?tab=proximos", title: "Próximos Cursos", desc: "Cursos con inscripción abierta" },
  { route: "/cursos?tab=mis-cursos", title: "Mis Cursos", desc: "Cursos en los que estás matriculado" },
  { route: "/cursos?tab=catalogo", title: "Catálogo de Cursos", desc: "Listado completo de cursos disponibles" },
  { route: "/cursos?tab=mis-cursos&filtro=realizados", title: "Cursos Realizados", desc: "Cursos que has completado" },
  { route: "/captura-necesidades", title: "Captura de Necesidades", desc: "Solicitar cursos para tu desarrollo profesional" },
  { route: "/captura-necesidades?year=proximo", title: "Necesidades Próximo Año", desc: "Solicitudes de formación para el próximo año" },
  { route: "/captura-necesidades?solicitar=true", title: "Solicitar Necesidad", desc: "Crear una nueva solicitud de necesidad formativa" },
  { route: "/encuestas?filtro=pendientes", title: "Encuestas Pendientes", desc: "Encuestas de satisfacción pendientes de realizar" },
  { route: "/encuestas?filtro=realizadas", title: "Encuestas Realizadas", desc: "Encuestas de formación ya completadas" },
  { route: "/evaluaciones", title: "Mis Evaluaciones", desc: "Panel de acceso a evaluaciones formativas" },
  { route: "/movilidad", title: "Mi Movilidad", desc: "Portal de movilidad formativa" },
  { route: "/movilidad-solicitudes", title: "Solicitudes de Movilidad", desc: "Gestionar traslados y comisiones de servicio" },
  { route: "/examenes-previstos", title: "Exámenes Previstos", desc: "Evaluaciones programadas en el futuro" },
  { route: "/examenes-proceso", title: "Exámenes en Proceso", desc: "Evaluaciones actualmente abiertas" },
  { route: "/examenes-realizados", title: "Exámenes Realizados", desc: "Historial de exámenes realizados" },
  { route: "/temarios", title: "Temarios", desc: "Materiales de estudio y guías formativas" },
  { route: "/sugerencias", title: "Sugerencias", desc: "Enviar y consultar sugerencias formativas" },
  { route: "/habilitaciones", title: "Habilitaciones", desc: "Certificaciones y acreditaciones profesionales" },
  { route: "/programas", title: "Programas Formativos", desc: "Itinerarios formativos completos" },
  { route: "/eventos-jornadas", title: "Eventos y Jornadas", desc: "Calendario de eventos formativos puntuales" },
  { route: "/profile", title: "Mi Perfil", desc: "Datos personales y de contacto" },
  { route: "/servicios", title: "Todas las Herramientas", desc: "Acceso rápido a todas las herramientas formativas" },
  { route: "/noticias", title: "Noticias Ferroviarias", desc: "Últimas noticias del sector y novedades institucionales" },
  { route: "/canales", title: "FormaciónTV", desc: "Contenidos audiovisuales formativos" },
  { route: "/pildoras", title: "Píldoras Formativas", desc: "Micro-learning formativo de temas específicos" },
  { route: "/mis-portales", title: "Mis Portales", desc: "Portales corporativos de Adif" },
  { route: "/docs", title: "Documentos", desc: "Documentación técnica y manuales formativos" },
  { route: "/links", title: "Enlaces de Interés", desc: "Recursos online del sector ferroviario" },
  { route: "/avisos", title: "Avisos", desc: "Notificaciones importantes del departamento de formación" },
  { route: "/agenda", title: "Agenda", desc: "Eventos formativos programados" },
  { route: "/expediente", title: "Mi Expediente", desc: "Historial formativo personal completo" },
  { route: "/settings", title: "Ajustes", desc: "Configuración general de la aplicación" },
];

export function globalSearch(query) {
  const trimmed = query.toLowerCase().trim();
  if (!trimmed) return new Map();

  const results = [];
  const seen = new Set();

  function add(type, title, description, route, category) {
    const key = `${type}:${title}`;
    if (seen.has(key)) return;
    seen.add(key);
    const cfg = TYPE_CONFIG[type];
    results.push({
      type,
      typeLabel: cfg?.label ?? type,
      title,
      description,
      route,
      category,
    });
  }

  // Cursos
  for (const c of CURSOS_DATA) {
    if (q(c.title, trimmed) || q(c.materia, trimmed)) {
      add(
        "curso",
        c.title,
        `${c.modality} · ${c.materia}`,
        `/cursos`,
        c.materia,
      );
    }
  }

  // Noticias
  for (const n of ALL_NOTICIAS) {
    if (q(n.title, trimmed) || q(n.content, trimmed)) {
      add("noticia", n.title, n.content.slice(0, 120), `/noticias`, n.category);
    }
  }

  // Documentos
  for (const d of DOCUMENTOS) {
    if (q(d.title, trimmed) || q(d.description, trimmed)) {
      add("documento", d.title, d.description, `/docs`, d.categoria);
    }
  }

  // Píldoras
  for (const p of PILDORAS) {
    if (q(p.title, trimmed) || q(p.description, trimmed)) {
      add("pildora", p.title, p.description, `/pildoras`, p.categoria);
    }
  }

  // Links
  for (const l of LINKS) {
    if (q(l.title, trimmed) || q(l.description, trimmed)) {
      add("link", l.title, l.description, `/links`, l.categoria);
    }
  }

  // Agenda
  for (const a of AGENDA_EVENTS) {
    if (q(a.title, trimmed) || q(a.description, trimmed)) {
      add("agenda", a.title, a.description, `/agenda`);
    }
  }

  // Exámenes (en proceso)
  for (const e of EXAMENES) {
    if (q(e.title, trimmed)) {
      add(
        "examen",
        e.title,
        `${e.fecha} · ${e.ubicacion}`,
        `/examenes-proceso`,
      );
    }
  }

  // Exámenes previstos
  for (const e of EXAMENES_PREVISTOS) {
    if (q(e.title, trimmed)) {
      add(
        "examen",
        e.title,
        `${e.fecha} · ${e.ubicacion}`,
        `/examenes-previstos`,
      );
    }
  }

  // Exámenes realizados
  for (const e of EXAMENES_REALIZADOS) {
    if (q(e.title, trimmed)) {
      add(
        "examen",
        e.title,
        `${e.fecha} · Resultado: ${e.resultado}`,
        `/examenes-realizados`,
      );
    }
  }

  // Eventos / Jornadas
  for (const ev of EVENTOS_JORNADAS) {
    if (q(ev.title, trimmed) || q(ev.description, trimmed)) {
      add(
        "evento",
        ev.title,
        `${ev.tipo} · ${ev.fecha}`,
        `/eventos-jornadas`,
        ev.tipo,
      );
    }
  }

  // Programas
  for (const p of PROGRAMAS) {
    if (q(p.title, trimmed) || q(p.description, trimmed)) {
      add("programa", p.title, p.description, `/programas`, p.categoria);
    }
  }

  // Temarios
  for (const t of TEMARIOS) {
    if (q(t.title, trimmed) || q(t.description, trimmed)) {
      add("temario", t.title, t.description, `/temarios`, t.materia);
    }
  }

  // Habilitaciones
  for (const h of HABILITACIONES) {
    if (q(h.title, trimmed)) {
      add(
        "habilitacion",
        h.title,
        `${h.tipo} · ${h.estado}`,
        `/habilitaciones`,
      );
    }
  }

  // Necesidades formativas
  for (const n of NECESIDADES) {
    if (q(n.title, trimmed) || q(n.description, trimmed)) {
      add(
        "necesidad",
        n.title,
        n.description.slice(0, 120),
        `/captura-necesidades`,
        n.materia,
      );
    }
  }

  // Sugerencias
  for (const s of SUGERENCIAS) {
    if (q(s.title, trimmed) || q(s.description, trimmed)) {
      add("sugerencia", s.title, s.description, `/sugerencias`);
    }
  }

  // Accesos Rápidos (botones de navegación)
  for (const btn of BUTTONS) {
    if (q(btn.title, trimmed) || q(btn.desc, trimmed)) {
      add("boton", btn.title, btn.desc, btn.route);
    }
  }

  // Acciones Pendientes
  for (const a of ACCIONES) {
    if (q(a.titulo, trimmed) || q(a.descripcion, trimmed)) {
      add(
        "accion",
        a.titulo,
        `${a.descripcion} · ${a.estado}`,
        `/accion/${a.id}`,
      );
    }
  }

  // Group by type
  const grouped = new Map();
  for (const r of results) {
    const list = grouped.get(r.typeLabel) ?? [];
    list.push(r);
    grouped.set(r.typeLabel, list);
  }

  return grouped;
}
