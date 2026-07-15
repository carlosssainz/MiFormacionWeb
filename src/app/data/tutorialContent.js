export const TUTORIALS = {
  "home-topbar": {
    title: "🎮 Barra superior",
    steps: [
      {
        target: "home-top-menu",
        title: "☰ Menú lateral",
        text: "Pulsa aquí para abrir el menú de navegación. Desde ahí puedes acceder a todas las secciones: cursos, avisos, agenda, perfil y mucho más.",
        showTap: true,
      },
      {
        target: "home-top-search",
        title: "🔍 Búsqueda universal",
        text: "Usa el buscador para encontrar rápidamente cualquier contenido: cursos, documentos, píldoras, noticias y más.",
        showTap: true,
      },
      {
        target: "home-top-acciones",
        title: "📋 Acciones pendientes",
        text: "Aquí tienes tus tareas pendientes: firmar documentos, completar encuestas, escanear QR de asistencia... El badge naranja te avisa si tienes alguna sin hacer.",
        showTap: true,
      },
      {
        target: "home-top-avisos",
        title: "🔔 Avisos",
        text: "Las notificaciones importantes del departamento de formación: convocatorias, cambios de horario, evaluaciones y recordatorios.",
        showTap: true,
      },
      {
        target: "home-top-perfil",
        title: "👤 Tu perfil",
        text: "Accede a tus datos personales, contactos clave y cierra sesión cuando termines.",
        showTap: true,
      },
    ],
  },

  "home-sections": {
    title: "🎮 Secciones del inicio",
    steps: [
      {
        target: "home-section-news",
        title: "📰 Últimas noticias",
        text: "Desliza para ver las noticias más recientes del sector ferroviario y las novedades institucionales de Adif.",
      },
      {
        target: "home-section-pending-actions",
        title: "⚡ Acciones pendientes",
        text: "Tus tareas más importantes aparecen aquí. Mantén pulsado el icono de 6 puntos para reordenar las secciones y personalizar tu pantalla.",
        showGrip: true,
        showDragLine: true,
      },
      {
        target: "home-section-servicios",
        title: "🛠️ Servicios de Formación",
        text: "Accede a cursos, píldoras formativas, FormaciónTV, catálogo, portales, documentos y enlaces de interés.",
      },
      {
        target: "home-section-plan",
        title: "📋 Mi Plan",
        text: "Gestiona tu plan formativo anual: consulta las necesidades del año actual, planifica el próximo o solicita nuevas necesidades.",
      },
      {
        target: "home-section-evaluaciones",
        title: "📝 Mis Evaluaciones",
        text: "Completa las encuestas de satisfacción de tus cursos realizados y envía sugerencias para mejorar la formación.",
      },
      {
        target: "home-section-movilidad",
        title: "🚄 Mi Movilidad",
        text: "Gestiona tus procesos de movilidad: solicitudes, exámenes previstos, en proceso, realizados y temarios de estudio.",
      },
    ],
  },

  "home-bottomnav": {
    title: "🎮 Navegación inferior",
    steps: [
      {
        target: "home-bottom-inicio",
        title: "🏠 Inicio",
        text: "Vuelve a la pantalla principal desde cualquier sección pulsando este icono.",
        showTap: true,
      },
      {
        target: "home-bottom-cursos",
        title: "📚 Cursos",
        text: "Accede a todos tus cursos: los que estás cursando, próximos, solicitados y el catálogo completo.",
        showTap: true,
      },
      {
        target: "home-bottom-solicitar",
        title: "➕ Solicitar formación",
        text: "Pulsa el botón + para solicitar teleformación del mes, cursos presenciales en tu territorio o explorar el catálogo.",
        showTap: true,
      },
      {
        target: "home-bottom-agenda",
        title: "📅 Agenda",
        text: "Consulta tu calendario formativo con todos los eventos programados: cursos, talleres, seminarios y evaluaciones.",
        showTap: true,
      },
      {
        target: "home-bottom-expediente",
        title: "📁 Expediente",
        text: "Revisa tu historial formativo completo: cursos realizados, habilitaciones, programas y certificaciones.",
        showTap: true,
      },
    ],
  },

  cursos: {
    title: "🎮 Navega por tus cursos",
    steps: [
      {
        target: "cursos-tabs",
        title: "📑 Pestañas de cursos",
        text: "Alterna entre Mis Cursos, Próximos, Solicitados y Catálogo para ver los cursos que te interesan.",
      },
      {
        target: "cursos-filters",
        title: "🔍 Buscar y filtrar",
        text: "Encuentra cursos rápidamente por materia, tipo, centro o mes. También puedes ordenar los resultados.",
      },
      {
        target: "cursos-card",
        title: "📇 Tarjetas de curso",
        text: "Cada curso muestra materia, modalidad, fechas, progreso y estado. Pulsa sobre él para ver toda la información.",
      },
    ],
  },

  "curso-detalle": {
    title: "🎮 Detalle del curso",
    steps: [
      {
        target: "detalle-info",
        title: "📋 Datos del curso",
        text: "Información académica completa: fechas, modalidad, plazas, duración y profesorado.",
      },
      {
        target: "detalle-calendario",
        title: "📅 Calendario",
        text: "Consulta el calendario detallado con todas las sesiones programadas del curso.",
      },
      {
        target: "detalle-temario",
        title: "📚 Temario",
        text: "Explora la estructura del curso con carpetas y archivos. Expande cada módulo para ver su contenido.",
      },
      {
        target: "detalle-acciones",
        title: "⚙️ Acciones",
        text: "Accede al Centro de Formación Virtual, descarga la guía en PDF o contacta con el formador.",
      },
    ],
  },

  avisos: {
    title: "🎮 Centro de avisos",
    steps: [
      {
        target: "avisos-filter-area",
        title: "🏷️ Filtrar y buscar",
        text: "Filtra por tipo de aviso (convocatorias, horarios, evaluaciones o recordatorios) y por estado. También puedes buscar por título.",
      },
      {
        target: "avisos-list",
        title: "📋 Lista de avisos",
        text: "Cada aviso muestra su categoría, título y nivel de urgencia. Los avisos urgentes aparecen marcados en rojo. Pulsa para ver el detalle completo.",
      },
    ],
  },

  agenda: {
    title: "🎮 Tu agenda formativa",
    steps: [
      {
        target: "agenda-vista",
        title: "📆 Vista semanal o mensual",
        text: "Alterna entre vista semanal y mensual para ver tus eventos formativos programados.",
      },
      {
        target: "agenda-eventos",
        title: "📌 Eventos del día",
        text: "Cada evento tiene un color según su tipo: cursos, talleres, seminarios, reuniones o evaluaciones.",
      },
      {
        target: "agenda-navegacion",
        title: "⏮️ Navegar entre fechas",
        text: "Usa las flechas para moverte entre semanas o meses y consulta tu calendario formativo completo.",
      },
    ],
  },

  perfil: {
    title: "🎮 Tu perfil",
    steps: [
      {
        target: "perfil-datos",
        title: "👤 Datos personales",
        text: "Tu información laboral y de contacto: unidad organizativa, puesto, email y teléfonos.",
      },
      {
        target: "perfil-contactos",
        title: "📞 Contactos clave",
        text: "Aquí tienes a tu validador de formación, interlocutor de RRHH y responsables directos.",
      },
      {
        target: "perfil-acciones",
        title: "🚪 Cerrar sesión",
        text: "Puedes cerrar sesión desde aquí cuando termines. Tus datos se guardarán automáticamente.",
      },
    ],
  },

  acciones: {
    title: "🎮 Acciones Pendientes",
    steps: [
      {
        target: "acciones-tabs",
        title: "📑 Pestañas",
        text: "Alterna entre Pendientes y Realizadas para ver las tareas que requieren tu atención o las que ya has completado.",
      },
      {
        target: "acciones-search",
        title: "🔍 Buscar acciones",
        text: "Filtra acciones por título o descripción escribiendo aquí. La lista se actualizará al instante.",
      },
      {
        target: "acciones-list",
        title: "📋 Lista de acciones",
        text: "Cada acción pendiente tiene un botón \"Realizar\" que te lleva directamente a la pantalla donde puedas completarla.",
      },
    ],
  },

  ajustes: {
    title: "🎮 Configuración",
    steps: [
      {
        target: "settings-apariencia",
        title: "🌓 Modo oscuro / claro",
        text: "Cambia la apariencia de la aplicación entre modo claro y modo oscuro según tu preferencia.",
      },
      {
        target: "settings-idioma",
        title: "🗣️ Idioma",
        text: "Selecciona tu idioma preferido entre las lenguas cooficiales disponibles.",
      },
      {
        target: "settings-info",
        title: "ℹ️ Información",
        text: "Consulta la versión de la aplicación y accede a la ayuda o al portal del empleado.",
      },
    ],
  },

  evaluaciones: {
    title: "🎮 Mis Evaluaciones",
    steps: [
      {
        target: "evaluaciones-encuestas",
        title: "📝 Encuestas de satisfacción",
        text: "Valora los cursos que has realizado completando las encuestas de satisfacción y transferencia.",
      },
      {
        target: "evaluaciones-sugerencias",
        title: "💬 Sugerencias",
        text: "Envía tus propuestas para mejorar la formación y consulta el estado de las que ya has enviado.",
      },
    ],
  },

  expediente: {
    title: "🎮 Mi Expediente",
    steps: [
      {
        target: "expediente-cursos",
        title: "📚 Cursos realizados",
        text: "Consulta tu historial de cursos completados, con fechas, modalidad y calificaciones.",
      },
      {
        target: "expediente-habilitaciones",
        title: "🛡️ Habilitaciones",
        text: "Revisa tus certificaciones profesionales: vigentes, próximas a caducar y caducadas.",
      },
      {
        target: "expediente-descarga",
        title: "⬇️ Descargar expediente",
        text: "Exporta tu expediente formativo completo en PDF para uso externo o trámites administrativos.",
      },
    ],
  },

  movilidad: {
    title: "🎮 Mi Movilidad",
    steps: [
      {
        target: "movilidad-solicitudes",
        title: "📋 Solicitudes",
        text: "Gestiona tus solicitudes de movilidad: traslados temporales o definitivos, comisiones de servicio y permutas.",
      },
      {
        target: "movilidad-examenes",
        title: "📄 Exámenes",
        text: "Consulta los exámenes previstos, en proceso y realizados relacionados con procesos de movilidad.",
      },
      {
        target: "movilidad-temarios",
        title: "📚 Temarios de estudio",
        text: "Accede a los materiales de estudio y guías para preparar las pruebas de movilidad.",
      },
    ],
  },

  servicios: {
    title: "🎮 Servicios de Formación",
    steps: [
      {
        target: "servicios-cursos",
        title: "📚 Cursos y píldoras",
        text: "Explora los próximos cursos, píldoras formativas, FormaciónTV y el catálogo completo.",
      },
      {
        target: "servicios-recursos",
        title: "🌐 Portales y recursos",
        text: "Accede a los portales corporativos, documentación técnica y enlaces de interés del sector.",
      },
    ],
  },

  herramientas: {
    title: "🎮 Todas las Herramientas",
    steps: [
      {
        target: "herramientas-cursos",
        title: "🔧 Catálogo de herramientas",
        text: "Encuentra todas las herramientas formativas disponibles: cursos, píldoras, canales y catálogo.",
      },
      {
        target: "herramientas-recursos",
        title: "🌐 Acceso a recursos",
        text: "Accede directamente a tus portales, documentos y enlaces de interés formativo.",
      },
    ],
  },

  pildoras: {
    title: "🎮 Píldoras Formativas",
    steps: [
      {
        target: "pildoras-search",
        title: "🔍 Buscar píldoras",
        text: "Encuentra micro-contenidos formativos buscando por título o descripción.",
      },
      {
        target: "pildoras-categorias",
        title: "🏷️ Filtrar por categoría",
        text: "Selecciona una categoría para filtrar las píldoras y encontrar las que más te interesen.",
      },
      {
        target: "pildoras-list",
        title: "📖 Contenido formativo",
        text: "Cada píldora muestra su categoría, duración estimada y fecha de publicación.",
      },
    ],
  },

  "captura-necesidades": {
    title: "🎮 Captura de Necesidades",
    steps: [
      {
        target: "necesidades-year",
        title: "📅 Seleccionar año",
        text: "Alterna entre el año en curso y el próximo para ver o crear necesidades formativas.",
      },
      {
        target: "necesidades-crear",
        title: "➕ Crear solicitud",
        text: "Pulsa aquí para formular una nueva necesidad formativa. Puedes guardarla como borrador o publicarla.",
      },
      {
        target: "necesidades-filtros",
        title: "🔍 Buscar y filtrar",
        text: "Filtra por materia, muestra solo tus borradores y ordena por popularidad para encontrar lo que buscas.",
      },
      {
        target: "necesidades-list",
        title: "📋 Lista de necesidades",
        text: "Cada necesidad muestra su materia, descripción y número de votos. Dale \"me gusta\" a las que te interesen.",
      },
    ],
  },
};
