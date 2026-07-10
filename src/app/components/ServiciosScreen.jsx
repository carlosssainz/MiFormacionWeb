import { useNavigate } from "react-router-dom";
import {
  Globe,
  Pill,
  Search,
  Calendar,
  FileText,
  Link as LinkIcon,
  Tv,
} from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { useI18n } from "../context/I18nContext";

export function ServiciosScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const servicios = [
    {
      id: "proximos",
      icon: <Calendar size={24} />,
      label: t("tools.upcomingCourses"),
      subtitle: t("tools.upcomingCoursesDesc"),
      screen: "/cursos?tab=proximos",
    },
    {
      id: "pildoras",
      icon: <Pill size={24} />,
      label: t("tools.pills"),
      subtitle: t("tools.pillsDesc"),
      screen: "/pildoras",
    },
    {
      id: "canales",
      icon: <Tv size={24} />,
      label: t("tools.trainingTV"),
      subtitle: t("tools.trainingTVDesc"),
      screen: "/canales",
    },
    {
      id: "catalogo",
      icon: <Search size={24} />,
      label: t("tools.catalog"),
      subtitle: t("tools.catalogDesc"),
      screen: "/cursos?tab=catalogo",
    },
    {
      id: "portales",
      icon: <Globe size={24} />,
      label: t("tools.portals"),
      subtitle: t("tools.portalsDesc"),
      screen: "/mis-portales",
    },
    {
      id: "docs",
      icon: <FileText size={24} />,
      label: t("tools.docs"),
      subtitle: t("tools.docsDesc"),
      screen: "/docs",
    },
    {
      id: "links",
      icon: <LinkIcon size={24} />,
      label: t("tools.links"),
      subtitle: t("tools.linksDesc"),
      screen: "/links",
    },
  ];

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("services.title")}
      helpKey="servicios"
    >
      <div className="grid grid-cols-2 gap-3">
        {servicios.map((s) => (
          <button
            key={s.id}
            onClick={() => navigate(s.screen)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-[#659B35] rounded-lg flex items-center justify-center text-white mb-3">
              {s.icon}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              {s.label}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {s.subtitle}
            </p>
          </button>
        ))}
      </div>
    </ScreenLayout>
  );
}
