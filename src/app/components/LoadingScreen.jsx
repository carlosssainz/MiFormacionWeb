import { useI18n } from "../context/I18nContext";

export function LoadingScreen({ message }) {
  const { t } = useI18n();
  const displayMessage = message ?? t("loading");
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#F5F5F5] dark:bg-gray-900 gap-6 overflow-hidden">
      <div className="relative w-80 h-40 max-w-full">
        <svg viewBox="0 0 300 140" className="w-full h-full">
          <defs>
            <style>{`
              @keyframes wheel-spin {
                to { transform: rotate(360deg); }
              }
              @keyframes chug {
                0%, 100% { transform: translateX(-1.5px); }
                50% { transform: translateX(1.5px); }
              }
              @keyframes smoke-rise {
                0% { transform: translateY(0) scale(1); opacity: 0.5; }
                100% { transform: translateY(-40px) scale(2.2); opacity: 0; }
              }
              .wheel { animation: wheel-spin 1.2s linear infinite; transform-origin: center; transform-box: fill-box; }
              .chassis { animation: chug 0.3s ease-in-out infinite; }
              .s1 { animation: smoke-rise 1.6s ease-out infinite; }
              .s2 { animation: smoke-rise 1.6s ease-out 0.53s infinite; }
              .s3 { animation: smoke-rise 1.6s ease-out 1.06s infinite; }
            `}</style>
          </defs>

          {/* Vías */}
          <line x1="0" y1="124" x2="300" y2="124" stroke="#555" strokeWidth="2" />
          <line x1="0" y1="131" x2="300" y2="131" stroke="#555" strokeWidth="2" />
          {Array.from({length: 12}, (_, i) => (
            <rect key={i} x={8 + i * 26} y="122" width="6" height="11" rx="1" fill="#7A6548" />
          ))}

          {/* Grupo del tren */}
          <g className="chassis">
            {/* Quitanieves (cowcatcher) */}
            <polygon points="48,106 62,84 62,106" fill="#4D7A28" />

            {/* Cuerpo principal */}
            <rect x="62" y="62" width="155" height="44" rx="7" fill="#659B35" />
            <rect x="62" y="90" width="155" height="6" fill="#4D7A28" opacity="0.3" />
            <line x1="75" y1="80" x2="210" y2="80" stroke="#A8D88A" strokeWidth="1.5" opacity="0.4" />

            {/* Detalle frontal */}
            <rect x="62" y="72" width="32" height="22" rx="4" fill="none" stroke="#4D7A28" strokeWidth="1.5" />
            <circle cx="78" cy="83" r="6.5" fill="none" stroke="#4D7A28" strokeWidth="1.5" />

            {/* Faro */}
            <circle cx="53" cy="78" r="6" fill="#FFE44D" />
            <circle cx="53" cy="78" r="3" fill="#FFF" />

            {/* Cabina */}
            <rect x="180" y="34" width="35" height="28" rx="5" fill="#4D7A28" />
            <rect x="188" y="40" width="18" height="14" rx="3" fill="#A8D88A" />
            <rect x="177" y="30" width="41" height="5" rx="2" fill="#3D6320" />

            {/* Chimenea */}
            <rect x="75" y="44" width="14" height="20" rx="2" fill="#4D7A28" />
            <rect x="72" y="42" width="20" height="4" rx="1.5" fill="#444" />

            {/* Humo */}
            <g>
              <circle cx="82" cy="36" r="6" fill="#BBB" className="s1" />
              <circle cx="82" cy="36" r="5" fill="#CCC" className="s2" />
              <circle cx="82" cy="36" r="4" fill="#DDD" className="s3" />
            </g>

            {/* Ruedas */}
            <g className="wheel">
              <circle cx="100" cy="107" r="12" fill="none" stroke="#444" strokeWidth="3.5" />
              <line x1="100" y1="97" x2="100" y2="117" stroke="#444" strokeWidth="2.5" />
              <line x1="90" y1="107" x2="110" y2="107" stroke="#444" strokeWidth="2.5" />
              <circle cx="100" cy="107" r="3.5" fill="#444" />
            </g>
            <g className="wheel">
              <circle cx="145" cy="107" r="12" fill="none" stroke="#444" strokeWidth="3.5" />
              <line x1="145" y1="97" x2="145" y2="117" stroke="#444" strokeWidth="2.5" />
              <line x1="135" y1="107" x2="155" y2="107" stroke="#444" strokeWidth="2.5" />
              <circle cx="145" cy="107" r="3.5" fill="#444" />
            </g>
            <g className="wheel">
              <circle cx="190" cy="107" r="12" fill="none" stroke="#444" strokeWidth="3.5" />
              <line x1="190" y1="97" x2="190" y2="117" stroke="#444" strokeWidth="2.5" />
              <line x1="180" y1="107" x2="200" y2="107" stroke="#444" strokeWidth="2.5" />
              <circle cx="190" cy="107" r="3.5" fill="#444" />
            </g>
          </g>
        </svg>
      </div>
      <p className="text-sm text-gray-500">{displayMessage}</p>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="animate-pulse p-4 space-y-4">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      <div className="space-y-2">
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  );
}
