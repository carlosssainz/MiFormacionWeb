import { useEffect, useRef, useState } from "react";
import { Clock, RefreshCw } from "lucide-react";
import QRCode from "qrcode";
import { getFormadorActiveCourses } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { ScreenLayout } from "./ScreenLayout";
import { useI18n } from "../context/I18nContext";

export function QRGeneratorScreen() {
  const { t } = useI18n();
  const { formadorName } = useAuth();
  const canvasRef = useRef(null);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [countdown, setCountdown] = useState(60);
  const [cursosActivos, setCursosActivos] = useState([]);

  useEffect(() => {
    const activos = getFormadorActiveCourses(formadorName);
    setCursosActivos(activos);
    if (activos.length > 0) {
      setSelectedCurso(activos[0]);
    }
  }, [formadorName]);

  useEffect(() => {
    if (!selectedCurso || !canvasRef.current) return;

    const generateQR = () => {
      const data = JSON.stringify({
        courseId: selectedCurso.id,
        timestamp: Date.now(),
      });
      QRCode.toCanvas(canvasRef.current, data, {
        width: 280,
        margin: 2,
        color: { dark: "#207041", light: "#ffffff" },
      });
    };

    generateQR();
    setCountdown(60);

    const refreshInterval = setInterval(generateQR, 60000);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 60));
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
    };
  }, [selectedCurso]);

  if (cursosActivos.length === 0) {
    return (
      <ScreenLayout
        headerMode="back"
        backTitle={t("scanner.attendanceTitle")}
        helpKey="qr-generator"
      >
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <Clock size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">
            {t("scanner.noActiveCourses")}
          </h2>
          <p className="text-gray-500 text-sm">
            {t("scanner.noActiveCoursesDesc")}
          </p>
        </div>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("scanner.attendanceTitle")}
      helpKey="qr-generator"
    >
      <div className="flex-1 overflow-y-scroll flex flex-col items-center px-6 py-8 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        {cursosActivos.length > 1 && (
          <div className="w-full mb-6">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              {t("scanner.selectCourse")}
            </label>
            <select
              value={selectedCurso?.id ?? ""}
              onChange={(e) => {
                const curso = cursosActivos.find(
                  (c) => c.id === e.target.value,
                );
                if (curso) setSelectedCurso(curso);
              }}
              className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A]"
            >
              {cursosActivos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.schedule})
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedCurso && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 w-full max-w-sm">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
                {selectedCurso.name}
              </h2>
              <p className="text-sm text-gray-500 text-center mb-4">
                {t("scanner.schedule").replace(
                  "{schedule}",
                  selectedCurso.schedule,
                )}
              </p>

              <div className="flex justify-center mb-4">
                <canvas
                  ref={canvasRef}
                  className="rounded-lg"
                  aria-label={t("qrGenerator.qrCodeLabel").replace(
                    "{courseName}",
                    selectedCurso?.name ?? "",
                  )}
                />
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <RefreshCw size={14} className="text-[#659B35]" />
                <span>
                  {t("scanner.refreshInfo").replace(
                    "{countdown}",
                    String(countdown),
                  )}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-500 text-center max-w-xs">
              {t("scanner.instructions")}
            </p>
          </>
        )}
        </div>
      </div>
    </ScreenLayout>
  );
}
