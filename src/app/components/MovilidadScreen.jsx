import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  FileCheck,
  BookOpen,
  PenLine,
} from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { useI18n } from "../context/I18nContext";

export function MovilidadScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const herramientas = [
    {
      id: "solicitudes",
      icon: <PenLine size={24} />,
      label: t("mobility.requests"),
      subtitle: t("mobility.requestsDesc"),
      screen: "/movilidad-solicitudes",
    },
    {
      id: "previstos",
      icon: <ClipboardList size={24} />,
      label: t("mobility.examsUpcoming"),
      subtitle: t("mobility.examsUpcomingDesc"),
      screen: "/examenes-previstos",
    },
    {
      id: "proceso",
      icon: <FileText size={24} />,
      label: t("mobility.examsInProgress"),
      subtitle: t("mobility.examsInProgressDesc"),
      screen: "/examenes-proceso",
    },
    {
      id: "realizados",
      icon: <FileCheck size={24} />,
      label: t("mobility.examsCompleted"),
      subtitle: t("mobility.examsCompletedDesc"),
      screen: "/examenes-realizados",
    },
    {
      id: "temarios",
      icon: <BookOpen size={24} />,
      label: t("mobility.syllabus"),
      subtitle: t("mobility.syllabusDesc"),
      screen: "/temarios",
    },
  ];

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("mobility.title")}
      helpKey="movilidad"
    >
      <div className="grid grid-cols-2 gap-3">
        {herramientas.map((h) => (
          <button
            key={h.id}
            onClick={() => navigate(h.screen)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-[#659B35] rounded-lg flex items-center justify-center text-white mb-3">
              {h.icon}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              {h.label}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {h.subtitle}
            </p>
          </button>
        ))}
      </div>
    </ScreenLayout>
  );
}
