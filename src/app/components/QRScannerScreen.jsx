import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, Smartphone } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { useI18n } from "../context/I18nContext";

export function QRScannerScreen() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [scanLineTop, setScanLineTop] = useState(0);
  const animRef = useRef(0);

  useEffect(() => {
    let direction = 1;
    let pos = 0;

    const animate = () => {
      pos += direction * 0.8;
      if (pos >= 85) direction = -1;
      if (pos <= 0) direction = 1;
      setScanLineTop(pos);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("scanner.title")}
      helpKey="qr-scanner"
      scrollable={false}
      hideBottomNav
    >
      <div className="flex-1 relative bg-black flex flex-col items-center justify-center">
        <div className="relative w-72 h-72">
          <div className="absolute inset-0 rounded-xl border-[3px] border-[#E3EB7A]/40" />

          <div
            className="absolute left-2 right-2 h-0.5 bg-[#E3EB7A] shadow-[0_0_8px_2px_#E3EB7A] transition-none"
            style={{ top: `${scanLineTop}%` }}
          />

          <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#E3EB7A] rounded-tl-lg" />
          <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#E3EB7A] rounded-tr-lg" />
          <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#E3EB7A] rounded-bl-lg" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#E3EB7A] rounded-br-lg" />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Smartphone size={64} className="text-[#E3EB7A]/70" />
            <p className="text-white/40 text-xs mt-3 tracking-widest uppercase">
              {t("scanner.simulation")}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-white/80">
            <Camera size={22} />
            <p className="text-sm">{t("scanner.placeholder")}</p>
          </div>
          <div className="flex gap-3 mt-1">
            <button
              onClick={() =>
                navigate("/qr-result", { state: { type: "success" } })
              }
              className="bg-[#659B35] hover:bg-[#207041] text-white text-sm font-semibold py-2 px-5 rounded-lg transition-colors"
            >
              {t("scanner.simulateCorrect")}
            </button>
            <button
              onClick={() =>
                navigate("/qr-result", {
                  state: { type: "error", message: t("scanner.errorMessage") },
                })
              }
              className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 px-5 rounded-lg transition-colors"
            >
              {t("scanner.simulateError")}
            </button>
          </div>
        </div>
      </div>
    </ScreenLayout>
  );
}
