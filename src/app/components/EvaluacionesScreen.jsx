import { useNavigate } from "react-router-dom";
import { ClipboardCheck, MessageSquare } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { useI18n } from "../context/I18nContext";

export function EvaluacionesScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();

  const items = [
    {
      id: "encuestas",
      icon: <ClipboardCheck size={24} />,
      label: t("surveys.title"),
      subtitle: t("evaluations.pendingDesc"),
      screen: "/encuestas",
    },
    {
      id: "sugerencias",
      icon: <MessageSquare size={24} />,
      label: t("evaluations.suggestions"),
      subtitle: t("evaluations.suggestionsDesc"),
      screen: "/sugerencias",
    },
  ];

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("evaluations.title")}
      helpKey="evaluaciones"
    >
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.screen)}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm text-left hover:shadow-md transition-shadow relative"
          >
            <div className="w-12 h-12 bg-[#659B35] rounded-lg flex items-center justify-center text-white mb-3">
              {item.icon}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
              {item.label}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.subtitle}
            </p>
          </button>
        ))}
      </div>
    </ScreenLayout>
  );
}
