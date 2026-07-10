import { lazy, Suspense, useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginScreen } from "./components/LoginScreen";
import { LoadingScreen } from "./components/LoadingScreen";
import { Sidebar } from "./components/Sidebar";
import { GlobalSearchModal } from "./components/GlobalSearchModal";

const HomeScreen = lazy(() =>
  import("./components/HomeScreen").then((m) => ({ default: m.HomeScreen })),
);
const AvisosScreen = lazy(() =>
  import("./components/AvisosScreen").then((m) => ({
    default: m.AvisosScreen,
  })),
);
const ProfileScreen = lazy(() =>
  import("./components/ProfileScreen").then((m) => ({
    default: m.ProfileScreen,
  })),
);
const NoticiasScreen = lazy(() =>
  import("./components/NoticiasScreen").then((m) => ({
    default: m.NoticiasScreen,
  })),
);
const AgendaScreen = lazy(() =>
  import("./components/AgendaScreen").then((m) => ({
    default: m.AgendaScreen,
  })),
);
const HerramientasScreen = lazy(() =>
  import("./components/HerramientasScreen").then((m) => ({
    default: m.HerramientasScreen,
  })),
);
const CursosScreen = lazy(() =>
  import("./components/CursosScreen").then((m) => ({
    default: m.CursosScreen,
  })),
);
const CursoDetalleScreen = lazy(() =>
  import("./components/CursoDetalleScreen").then((m) => ({
    default: m.CursoDetalleScreen,
  })),
);
const SettingsScreen = lazy(() =>
  import("./components/SettingsScreen").then((m) => ({
    default: m.SettingsScreen,
  })),
);
const CapturaNecesidadesScreen = lazy(() =>
  import("./components/CapturaNecesidadesScreen").then((m) => ({
    default: m.CapturaNecesidadesScreen,
  })),
);
const QRGeneratorScreen = lazy(() =>
  import("./components/QRGeneratorScreen").then((m) => ({
    default: m.QRGeneratorScreen,
  })),
);
const QRScannerScreen = lazy(() =>
  import("./components/QRScannerScreen").then((m) => ({
    default: m.QRScannerScreen,
  })),
);
const AsistenciaResultScreen = lazy(() =>
  import("./components/AsistenciaResultScreen").then((m) => ({
    default: m.AsistenciaResultScreen,
  })),
);
const ExamenesProcesoScreen = lazy(() =>
  import("./components/ExamenesProcesoScreen").then((m) => ({
    default: m.ExamenesProcesoScreen,
  })),
);
const ExamenesPrevistosScreen = lazy(() =>
  import("./components/ExamenesPrevistosScreen").then((m) => ({
    default: m.ExamenesPrevistosScreen,
  })),
);
const ExamenesRealizadosScreen = lazy(() =>
  import("./components/ExamenesRealizadosScreen").then((m) => ({
    default: m.ExamenesRealizadosScreen,
  })),
);
const TemariosScreen = lazy(() =>
  import("./components/TemariosScreen").then((m) => ({
    default: m.TemariosScreen,
  })),
);
const EncuestasScreen = lazy(() =>
  import("./components/EncuestasScreen").then((m) => ({
    default: m.EncuestasScreen,
  })),
);
const MisPortalesScreen = lazy(() =>
  import("./components/MisPortalesScreen").then((m) => ({
    default: m.MisPortalesScreen,
  })),
);
const MovilidadScreen = lazy(() =>
  import("./components/MovilidadScreen").then((m) => ({
    default: m.MovilidadScreen,
  })),
);
const ServiciosScreen = lazy(() =>
  import("./components/ServiciosScreen").then((m) => ({
    default: m.ServiciosScreen,
  })),
);
const CanalesScreen = lazy(() =>
  import("./components/CanalesScreen").then((m) => ({
    default: m.CanalesScreen,
  })),
);
const PildorasScreen = lazy(() =>
  import("./components/PildorasScreen").then((m) => ({
    default: m.PildorasScreen,
  })),
);
const DocsScreen = lazy(() =>
  import("./components/DocsScreen").then((m) => ({ default: m.DocsScreen })),
);
const LinksScreen = lazy(() =>
  import("./components/LinksScreen").then((m) => ({ default: m.LinksScreen })),
);
const ExpedienteScreen = lazy(() =>
  import("./components/ExpedienteScreen").then((m) => ({
    default: m.ExpedienteScreen,
  })),
);
const HabilitacionesScreen = lazy(() =>
  import("./components/HabilitacionesScreen").then((m) => ({
    default: m.HabilitacionesScreen,
  })),
);
const ProgramasScreen = lazy(() =>
  import("./components/ProgramasScreen").then((m) => ({
    default: m.ProgramasScreen,
  })),
);
const EventosJornadasScreen = lazy(() =>
  import("./components/EventosJornadasScreen").then((m) => ({
    default: m.EventosJornadasScreen,
  })),
);
const EvaluacionesScreen = lazy(() =>
  import("./components/EvaluacionesScreen").then((m) => ({
    default: m.EvaluacionesScreen,
  })),
);
const SugerenciasScreen = lazy(() =>
  import("./components/SugerenciasScreen").then((m) => ({
    default: m.SugerenciasScreen,
  })),
);
const AccionesScreen = lazy(() =>
  import("./components/AccionesScreen").then((m) => ({
    default: m.AccionesScreen,
  })),
);
const MovilidadSolicitudesScreen = lazy(() =>
  import("./components/MovilidadSolicitudesScreen").then((m) => ({
    default: m.MovilidadSolicitudesScreen,
  })),
);
const PendientesFirmaScreen = lazy(() =>
  import("./components/PendientesFirmaScreen").then((m) => ({
    default: m.PendientesFirmaScreen,
  })),
);


function AppRoutes() {
  const {
    isLoggedIn,
    menuOpen,
    setMenuOpen,
    globalSearchOpen,
    setGlobalSearchOpen,
  } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setGlobalSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setGlobalSearchOpen]);

  if (!isLoggedIn) {
    return <LoginScreen />;
  }

  return (
    <div className="h-full">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <GlobalSearchModal
        open={globalSearchOpen}
        onClose={() => setGlobalSearchOpen(false)}
      />

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/avisos" element={<AvisosScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/noticias" element={<NoticiasScreen />} />
          <Route path="/agenda" element={<AgendaScreen />} />
          <Route path="/herramientas" element={<HerramientasScreen />} />
          <Route path="/cursos" element={<CursosScreen />} />
          <Route path="/curso/:id" element={<CursoDetalleScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route
            path="/captura-necesidades"
            element={<CapturaNecesidadesScreen />}
          />
          <Route path="/qr-generator" element={<QRGeneratorScreen />} />
          <Route path="/qr-scanner" element={<QRScannerScreen />} />
          <Route path="/qr-result" element={<AsistenciaResultScreen />} />
          <Route path="/examenes-proceso" element={<ExamenesProcesoScreen />} />
          <Route
            path="/examenes-previstos"
            element={<ExamenesPrevistosScreen />}
          />
          <Route
            path="/examenes-realizados"
            element={<ExamenesRealizadosScreen />}
          />
          <Route path="/temarios" element={<TemariosScreen />} />
          <Route path="/encuestas" element={<EncuestasScreen />} />
          <Route path="/mis-portales" element={<MisPortalesScreen />} />
          <Route path="/movilidad" element={<MovilidadScreen />} />
          <Route path="/servicios" element={<ServiciosScreen />} />
          <Route path="/canales" element={<CanalesScreen />} />
          <Route path="/pildoras" element={<PildorasScreen />} />
          <Route path="/docs" element={<DocsScreen />} />
          <Route path="/links" element={<LinksScreen />} />
          <Route path="/expediente" element={<ExpedienteScreen />} />
          <Route path="/habilitaciones" element={<HabilitacionesScreen />} />
          <Route path="/programas" element={<ProgramasScreen />} />
          <Route path="/eventos-jornadas" element={<EventosJornadasScreen />} />
          <Route path="/evaluaciones" element={<EvaluacionesScreen />} />
          <Route path="/sugerencias" element={<SugerenciasScreen />} />
          <Route path="/acciones" element={<AccionesScreen />} />

          <Route
            path="/movilidad-solicitudes"
            element={<MovilidadSolicitudesScreen />}
          />
          <Route
            path="/documentos"
            element={<PendientesFirmaScreen />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  );
}
