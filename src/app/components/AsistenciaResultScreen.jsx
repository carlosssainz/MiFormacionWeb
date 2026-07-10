import { useNavigate, useLocation } from "react-router-dom";
import { Check, X, Home } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

export function AsistenciaResultScreen() {
  const { t } = useI18n();
  const { completarAccionPorTipo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state;
  const type = state?.type ?? "error";
  const message = state?.message;
  const isSuccess = type === "success";

  if (isSuccess) {
    completarAccionPorTipo("asistencia");
  }

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("result.title")}
      helpKey="asistencia-resultado"
    >
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 ${
            isSuccess ? "bg-[#F5F5F5]" : "bg-red-100"
          }`}
        >
          <div
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isSuccess ? "bg-[#659B35]" : "bg-red-500"
            }`}
          >
            {isSuccess ? (
              <Check size={48} className="text-white" strokeWidth={3} />
            ) : (
              <X size={48} className="text-white" strokeWidth={3} />
            )}
          </div>
        </div>

        <h1
          className={`text-2xl font-bold text-center mb-2 ${
            isSuccess
              ? "text-[#207041] dark:text-[#85C34A]"
              : "text-red-700 dark:text-red-400"
          }`}
        >
          {isSuccess ? t("result.attendanceConfirmed") : t("result.error")}
        </h1>

        {message && (
          <p className="text-gray-500 text-sm text-center mb-8">{message}</p>
        )}

        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          <Home size={20} />
          {t("result.goHome")}
        </button>
      </div>
    </ScreenLayout>
  );
}
