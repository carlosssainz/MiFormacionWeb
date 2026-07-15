import { useState, useEffect } from "react";
import { Pointer } from "lucide-react";

const GREEN = "#65A83E";

function DragLineSvg({ height }) {
  const cX = 12;
  const h = Math.max(height, 60);

  return (
    <svg width="24" height={h} viewBox={`0 0 24 ${h}`}>
      <line x1={cX} y1="14" x2={cX} y2={h - 14} stroke={GREEN} strokeWidth="2" strokeDasharray="4,5" />
      <polygon points={`${cX},8 ${cX - 5},18 ${cX + 5},18`} fill={GREEN} className="animate-tutorial-arrow-up" />
      <polygon points={`${cX},${h - 8} ${cX - 5},${h - 18} ${cX + 5},${h - 18}`} fill={GREEN} className="animate-tutorial-arrow-down" />
      <circle cx={cX} cy={h / 2} r="3" fill={GREEN} opacity="0.35" />
    </svg>
  );
}

const STEP_CARDS = [
  { num: 1, title: "Mantén pulsado", desc: "el icono de 6 puntos" },
  { num: 2, title: "Arrastra la sección", desc: "hacia arriba o abajo" },
  { num: 3, title: "Suelta para colocarla", desc: "en la posición deseada" },
];

export function ReorderTutorial({ onClose, onQuickGuide }) {
  const [sectionRect, setSectionRect] = useState(null);
  const [gripRect, setGripRect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Delay to let DOM settle
    const timer = setTimeout(() => {
      measure();
    }, 100);

    const measure = () => {
      setIsMobile(window.innerWidth < 640);

      const section = document.querySelector('[data-tutorial="section"]');
      if (!section) return;

      const r = section.getBoundingClientRect();
      setSectionRect({
        top: r.top - 10,
        left: r.left - 10,
        width: r.width + 20,
        height: r.height + 20,
      });

      const grip = section.querySelector('[data-tutorial="grip"]');
      if (grip) setGripRect(grip.getBoundingClientRect());
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      measure();
    };

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", handleResize);
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
    };
  }, []);

  const cardsTop = sectionRect
    ? Math.min(sectionRect.top + sectionRect.height + 20, window.innerHeight - 340)
    : 0;

  const cardsLeft = sectionRect
    ? isMobile
      ? Math.max(16, (window.innerWidth - 270) / 2)
      : Math.min(sectionRect.left + sectionRect.width + 28, window.innerWidth - 310)
    : 0;

  const dragLineLeft = sectionRect
    ? sectionRect.left + sectionRect.width + 4
    : 0;

  const handLeft = gripRect ? gripRect.left - 46 : 0;
  const handTop = gripRect ? gripRect.top + gripRect.height / 2 - 18 : 0;

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.3s" }}>
      <div className="absolute inset-0 bg-black/65" />

      {/* Spotlight */}
      {sectionRect && (
        <div
          className="absolute rounded-xl pointer-events-none animate-tutorial-glow"
          style={{
            top: sectionRect.top,
            left: sectionRect.left,
            width: sectionRect.width,
            height: sectionRect.height,
            border: `2px dashed ${GREEN}`,
          }}
        />
      )}

      {/* Grip capsule */}
      {gripRect && (
        <div
          className="absolute pointer-events-none animate-tutorial-grip"
          style={{
            top: gripRect.top - 8,
            left: gripRect.left - 8,
            width: gripRect.width + 16,
            height: gripRect.height + 16,
            borderRadius: 9999,
            backgroundColor: "rgba(255,255,255,0.95)",
            border: `2px solid ${GREEN}`,
            boxShadow: `0 0 16px rgba(101,168,62,0.55)`,
          }}
        />
      )}

      {/* Hand */}
      {gripRect && (
        <div
          className="absolute pointer-events-none animate-tutorial-hand z-10"
          style={{ top: handTop, left: handLeft }}
        >
          <Pointer size={36} stroke={GREEN} strokeWidth={2} style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))" }} />
        </div>
      )}

      {/* Drag line */}
      {sectionRect && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: sectionRect.top + 10,
            left: dragLineLeft,
            height: sectionRect.height - 20,
          }}
        >
          <DragLineSvg height={sectionRect.height - 20} />
        </div>
      )}

      {/* Title */}
      <div className="absolute left-0 right-0 text-center pointer-events-none px-4" style={{ top: 44 }}>
        <h2 className="text-white font-bold text-xl sm:text-2xl leading-tight" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.35)" }}>
          Reordena tus secciones fácilmente
        </h2>
        <p className="text-white/85 text-sm sm:text-base mt-2 max-w-xs mx-auto leading-tight">
          Usa el icono de 6 puntos para mover las secciones y personalizar tu pantalla.
        </p>
      </div>

      {/* Step cards */}
      <div
        className="absolute pointer-events-auto"
        style={{ top: cardsTop, left: cardsLeft }}
      >
        {STEP_CARDS.map((c, i) => (
          <div
            key={c.num}
            className="bg-white rounded-2xl shadow-lg p-3.5 flex items-center gap-3.5 mb-2.5"
            style={{ width: 260, animation: `tutorial-card-in 0.4s ease-out ${0.12 * i}s both` }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-base shrink-0"
              style={{ backgroundColor: GREEN }}
            >
              {c.num}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm leading-tight">{c.title}</p>
              <p className="text-gray-500 text-xs mt-0.5 leading-tight">{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom buttons */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3 pointer-events-auto px-6">
        <button
          onClick={onClose}
          className="text-white font-semibold py-3 px-8 rounded-xl transition-all w-full max-w-xs shadow-lg"
          style={{ backgroundColor: GREEN }}
        >
          Entendido
        </button>
        <button
          onClick={onQuickGuide}
          className="text-white/70 hover:text-white text-sm underline underline-offset-2 transition-colors"
        >
          📖 Ver guía rápida
        </button>
      </div>
    </div>
  );
}
