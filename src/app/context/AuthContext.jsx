import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { CURRENT_USER_NAME } from "../data/mockData";
import {
  initialAvisos,
  ENCUESTAS,
  PENDIENTES_FIRMA,
  ACCIONES,
  ACCIONES_HISTORICO,
} from "../data/mockData";
import { useI18n } from "./I18nContext";

const AuthContext = createContext(null);

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().split("T")[0];
}

function cleanupRealizadas(acciones) {
  const cutoff = daysAgo(7);
  const activas = [];
  const historico = [];
  for (const a of acciones) {
    if (a.estado === "realizada" && a.fechaRealizacion && a.fechaRealizacion < cutoff) {
      historico.push({
        id: a.id,
        tipo: a.tipo,
        titulo: a.titulo,
        descripcion: a.descripcion,
        fechaRealizacion: a.fechaRealizacion,
      });
    } else {
      activas.push(a);
    }
  }
  return { activas, historico };
}

export function AuthProvider({ children }) {
  const { formatDate } = useI18n();
  const [state, setState] = useState({
    isLoggedIn: false,
    role: "alumno",
    username: "",
    formadorName: "",
  });
  const pendingCount = ENCUESTAS.filter(
    (e) => e.estado === "no-realizado",
  ).length;
  const [pendientesFirma, setPendientesFirma] = useState(PENDIENTES_FIRMA);
  const pendingFirmaCount = pendientesFirma.filter(
    (p) => p.estado === "pendiente",
  ).length;

  const [avisos, setAvisos] = useState([...initialAvisos]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);

  const { activas: cleanedActivas } = cleanupRealizadas(ACCIONES);
  const [acciones, setAcciones] = useState(cleanedActivas);
  const [accionesHistorico, setAccionesHistorico] = useState(ACCIONES_HISTORICO);

  const login = useCallback((username, password) => {
    const isFormador = username === "admin" && password === "admin";
    setState({
      isLoggedIn: true,
      role: isFormador ? "formador" : "alumno",
      username,
      formadorName: isFormador ? CURRENT_USER_NAME : "",
    });
  }, []);

  const logout = useCallback(() => {
    setState({
      isLoggedIn: false,
      role: "alumno",
      username: "",
      formadorName: "",
    });
    setMenuOpen(false);
  }, []);

  const markAvisoRead = useCallback((id) => {
    setAvisos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, unread: false } : a)),
    );
  }, []);

  const firmarAsistencia = useCallback((id) => {
    setPendientesFirma((prev) =>
      prev.map((p) => (p.id === id ? { ...p, estado: "firmado" } : p)),
    );
  }, []);

  const completarAccion = useCallback((id) => {
    const now = todayStr();
    setAcciones((prev) => {
      let moved = null;
      const next = prev.map((a) => {
        if (a.id === id && a.estado === "pendiente") {
          moved = { ...a, estado: "realizada", fechaRealizacion: now };
          return moved;
        }
        return a;
      });
      if (moved) {
        const { historico } = cleanupRealizadas(next);
        if (historico.length > 0) {
          setAccionesHistorico((h) => [...historico, ...h]);
        }
      }
      return next;
    });
  }, []);

  const completarAccionPorTipo = useCallback((tipo) => {
    const now = todayStr();
    setAcciones((prev) => {
      let moved = null;
      const next = prev.map((a) => {
        if (a.tipo === tipo && a.estado === "pendiente") {
          moved = { ...a, estado: "realizada", fechaRealizacion: now };
          return moved;
        }
        return a;
      });
      if (moved) {
        const { historico } = cleanupRealizadas(next);
        if (historico.length > 0) {
          setAccionesHistorico((h) => [...historico, ...h]);
        }
      }
      return next;
    });
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((v) => !v);
  }, []);

  const unreadCount = useMemo(
    () => avisos.filter((a) => a.unread).length,
    [avisos],
  );

  const pendingAccionesCount = useMemo(
    () => acciones.filter((a) => a.estado === "pendiente").length,
    [acciones],
  );

  const value = useMemo(
    () => ({
      ...state,
      avisos,
      unreadCount,
      pendingFirmaCount,
      pendientesFirma,
      acciones,
      accionesHistorico,
      pendingAccionesCount,
      firmarAsistencia,
      completarAccion,
      completarAccionPorTipo,
      login,
      logout,
      markAvisoRead,
      toggleMenu,
      menuOpen,
      setMenuOpen,
      globalSearchOpen,
      setGlobalSearchOpen,
    }),
    [
      state,
      avisos,
      unreadCount,
      pendingFirmaCount,
      pendientesFirma,
      acciones,
      accionesHistorico,
      pendingAccionesCount,
      firmarAsistencia,
      completarAccion,
      completarAccionPorTipo,
      login,
      logout,
      markAvisoRead,
      toggleMenu,
      menuOpen,
      globalSearchOpen,
      setGlobalSearchOpen,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
