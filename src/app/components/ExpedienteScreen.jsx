import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Shield,
  Award,
  Calendar,
  ChevronRight,
  Pencil,
  Download,
} from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { ContextualHelp } from "./ContextualHelp";
import { useI18n } from "../context/I18nContext";
import { useAuth } from "../context/AuthContext";

export function ExpedienteScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { pendingFirmaCount } = useAuth();
  const [helpOpen, setHelpOpen] = useState(false);

  const items = [
    {
      id: "cursos",
      icon: <BookOpen size={28} />,
      label: t("expediente.myCourses"),
      subtitle: t("expediente.myCoursesDesc"),
      screen: "/cursos?tab=mis-cursos&filtro=realizados",
    },
    {
      id: "habilitaciones",
      icon: <Shield size={28} />,
      label: t("expediente.myHabilitaciones"),
      subtitle: t("expediente.myHabilitacionesDesc"),
      screen: "/habilitaciones",
    },
    {
      id: "programas",
      icon: <Award size={28} />,
      label: t("expediente.myPrograms"),
      subtitle: t("expediente.myProgramsDesc"),
      screen: "/programas",
    },
    {
      id: "eventos",
      icon: <Calendar size={28} />,
      label: t("expediente.events"),
      subtitle: t("expediente.eventsDesc"),
      screen: "/eventos-jornadas",
    },
    {
      id: "documentos",
      icon: (
        <div className="relative">
          <Pencil size={28} />
          {pendingFirmaCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-0.5">
              {pendingFirmaCount}
            </span>
          )}
        </div>
      ),
      label: "Documentos",
      subtitle: `${pendingFirmaCount} documentos emitidos y recibidos`,
      screen: "/documentos",
    },
  ];

  return (
    <ScreenLayout
      headerMode="top"
      onHelpClick={() => setHelpOpen(true)}
    >


      <div className="px-4 space-y-3 pb-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.screen)}
            className="w-full bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-5 text-left active:opacity-90"
          >
            <div className="w-14 h-14 bg-[#659B35] dark:bg-[#85C34A] rounded-xl flex items-center justify-center text-white shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-base">
                {item.label}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {item.subtitle}
              </p>
            </div>
            <ChevronRight size={22} className="text-gray-400 shrink-0" />
          </button>
        ))}
      </div>

      <div className="px-4 pb-4">
        <button
          onClick={() => {
            const name = "EXPEDIENTE_COMPLETO.pdf";
            const blob = new Blob(
              ["Expediente formativo completo - Adif"],
              { type: "application/pdf" },
            );
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = name;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold text-sm transition-colors"
        >
          <Download size={16} /> {t("expediente.download")}
        </button>
      </div>

      <ContextualHelp
        helpKey="expediente"
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </ScreenLayout>
  );
}
