import { useState, useEffect } from "react";
import { Pointer } from "lucide-react";
import { useTutorial } from "../context/TutorialContext";

const GREEN = "#65A83E";

const DIRECTION_ANGLE = { up: 0, down: 180, left: -90, right: 90 };
const HAND_SHADOW = { filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.15))" };

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

function ConfettiPiece({ index }) {
  const colors = ["#65A83E", "#E3EB7A", "#85C34A", "#207041", "#FFD93D", "#6BB5FF"];
  const color = colors[index % colors.length];
  const left = 10 + Math.random() * 80;
  const size = 6 + Math.random() * 8;
  const duration = 2.5 + Math.random() * 2;
  const delay = Math.random() * 0.8;

  return (
    <div
      className="absolute top-0 animate-confetti"
      style={{
        left: `${left}%`,
        width: size,
        height: size * 1.4,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        opacity: 0,
      }}
    />
  );
}

function CelebrateScreen({ tutorialTitle, onClose, buttonText }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-5 px-6 text-center animate-celebrate-fade-in-up">
        <div className="w-24 h-24 rounded-full bg-[#65A83E] flex items-center justify-center animate-badge-pop shadow-lg shadow-[#65A83E]/40">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-white font-bold text-2xl" style={{ textShadow: "0 2px 10px rgba(0,0,0,0.35)" }}>
          ¡Tutorial completado!
        </h2>

        <p className="text-white/80 text-sm max-w-xs">
          Has completado el tutorial de <strong className="text-white">{tutorialTitle.replace("🎮 ", "")}</strong>
        </p>

        <button
          onClick={onClose}
          className="mt-2 px-8 py-2.5 bg-white text-[#207041] font-bold rounded-xl text-sm hover:bg-white/90 transition-colors shadow-lg"
        >
          {buttonText || "Volver al inicio"}
        </button>
      </div>
    </div>
  );
}

function getTapDirection(rect) {
  const midY = rect.top + rect.height / 2;
  const centerY = window.innerHeight / 2;
  return midY < centerY ? "up" : "down";
}

function getTapHandPosition(rect) {
  const dir = getTapDirection(rect);
  const GAP = 16;
  const ICON_SIZE = 36;
  const half = ICON_SIZE / 2;

  let top;
  const left = rect.left + rect.width / 2 - half;

  if (dir === "up") {
    top = rect.top + rect.height + GAP;
  } else {
    top = rect.top - GAP - ICON_SIZE;
  }

  top = Math.max(8, Math.min(top, window.innerHeight - ICON_SIZE - 8));

  return { top, left };
}

export function TutorialOverlay({ steps, tutorialTitle, onClose, onQuickGuide, tutorialKey, autoShow, onSkip, celebrateButtonText }) {
  const { markComplete } = useTutorial();
  const [current, setCurrent] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [gripRect, setGripRect] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [visitedSteps, setVisitedSteps] = useState(new Set([0]));

  const step = steps[current];
  const isLast = current === steps.length - 1;
  const isFirst = current === 0;

  const measure = () => {
    setIsMobile(window.innerWidth < 640);
    if (!step?.target) { setTargetRect(null); return; }

    const el = document.querySelector(`[data-tutorial="${step.target}"]`);
    if (!el) { setTargetRect(null); return; }

    const r = el.getBoundingClientRect();
    setTargetRect({
      top: r.top - 10,
      left: r.left - 10,
      width: r.width + 20,
      height: r.height + 20,
    });

    if (step.showGrip) {
      const grip = document.querySelector('[data-tutorial="grip"]');
      setGripRect(grip ? grip.getBoundingClientRect() : null);
    } else {
      setGripRect(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    const scrollAndMeasure = () => {
      if (step?.target) {
        const el = document.querySelector(`[data-tutorial="${step.target}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(measure, 350);
        } else {
          measure();
        }
      } else {
        measure();
      }
    };
    const timer = setTimeout(scrollAndMeasure, 80);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      document.body.style.overflow = "";
    };
  }, [step]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") { onClose(); return; }
      if ((e.key === "ArrowRight" || e.key === "ArrowDown") && !isLast) goNext();
      if ((e.key === "ArrowLeft" || e.key === "ArrowUp") && !isFirst) goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, isFirst, isLast, current, steps.length]);

  function goNext() {
    const next = current + 1;
    setVisitedSteps((prev) => new Set(prev).add(next));
    setCurrent(next);
  }

  function goPrev() {
    setCurrent((s) => s - 1);
  }

  function handleFinish() {
    if (tutorialKey) {
      markComplete(tutorialKey);
    }
    setCelebrating(true);
  }

  function handleCloseCelebration() {
    setCelebrating(false);
    onClose();
  }

  function handleSkip() {
    if (onSkip) onSkip();
    else onClose();
  }

  if (celebrating) {
    return <CelebrateScreen tutorialTitle={tutorialTitle} onClose={handleCloseCelebration} buttonText={celebrateButtonText} />;
  }

  if (!mounted || !step) return null;

  const TITLE_BAR_HEIGHT = 80;
  const headerAtBottom = targetRect && (targetRect.top + targetRect.height) < TITLE_BAR_HEIGHT + 10;

  const CARD_W = 270;
  const CARD_H_EST = 190;
  const CARD_GAP = 64;

  function calcCardLeft(tr, isMob, vw) {
    if (isMob) return Math.max(12, (vw - CARD_W) / 2);
    const rightPos = tr.left + tr.width + CARD_GAP;
    if (rightPos + CARD_W < vw - 12) return rightPos;
    const leftPos = tr.left - CARD_GAP - CARD_W;
    if (leftPos > 12) return leftPos;
    return (vw - CARD_W) / 2;
  }

  function calculateCardPosition(tr, isMob) {
    if (!tr) return { top: 80, left: 0 };
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const BOTTOM_THRESHOLD = vh * 0.65;
    if (tr.top + tr.height / 2 > BOTTOM_THRESHOLD) {
      return { top: 90, left: calcCardLeft(tr, isMob, vw) };
    }

    const belowTop = tr.top + tr.height + CARD_GAP;
    if (belowTop + CARD_H_EST + 64 < vh) {
      return { top: belowTop, left: calcCardLeft(tr, isMob, vw) };
    }

    const aboveTop = tr.top - CARD_GAP - CARD_H_EST;
    if (aboveTop > 80) {
      return { top: aboveTop, left: calcCardLeft(tr, isMob, vw) };
    }

    if (!isMob) {
      const rightOf = tr.left + tr.width + CARD_GAP;
      if (rightOf + CARD_W < vw - 12) {
        return { top: Math.max(80, tr.top + tr.height / 2 - CARD_H_EST / 2), left: rightOf };
      }
      const leftOf = tr.left - CARD_GAP - CARD_W;
      if (leftOf > 12) {
        return { top: Math.max(80, tr.top + tr.height / 2 - CARD_H_EST / 2), left: leftOf };
      }
    }

    return { top: Math.max(80, (vh - CARD_H_EST) / 2), left: isMob ? 12 : (vw - CARD_W) / 2 };
  }

  const { top: cardTop, left: cardLeft } = calculateCardPosition(targetRect, isMobile);

  return (
    <div className="fixed inset-0 z-50" style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.3s" }}>
      <div className="absolute inset-0 bg-black/65" />

      {/* Spotlight */}
      {targetRect && (
        <div
          className="absolute rounded-xl pointer-events-none animate-tutorial-glow"
          style={{
            top: targetRect.top,
            left: targetRect.left,
            width: targetRect.width,
            height: targetRect.height,
            border: `2px dashed ${GREEN}`,
            transition: "all 0.3s ease-out",
          }}
        />
      )}

      {/* Grip capsule */}
      {gripRect && step.showGrip && (
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
            transition: "all 0.3s ease-out",
          }}
        />
      )}

      {/* Hand */}
      {gripRect && step.showGrip && (
        <div
          className="absolute pointer-events-none animate-tutorial-hand z-10"
          style={{ top: gripRect.top + gripRect.height / 2 - 18, left: gripRect.left - 36, transition: "all 0.3s ease-out" }}
        >
          <Pointer size={36} stroke={GREEN} strokeWidth={2} style={HAND_SHADOW} />
        </div>
      )}

      {/* Tap hand */}
      {targetRect && step.showTap && (
        <div
          className="absolute pointer-events-none z-10"
          style={{ ...getTapHandPosition(targetRect), transition: "all 0.3s ease-out" }}
        >
          <div className="animate-tutorial-hand">
            <Pointer
              size={36}
              stroke={GREEN}
              strokeWidth={2}
              style={{
                ...HAND_SHADOW,
                transform: `rotate(${DIRECTION_ANGLE[getTapDirection(targetRect)] || 0}deg)`,
                transformOrigin: "center",
              }}
            />
          </div>
        </div>
      )}

      {/* Drag line */}
      {targetRect && step.showDragLine && (
        <div
          className="absolute pointer-events-none"
          style={{ top: targetRect.top + 10, left: targetRect.left + targetRect.width + 4, height: targetRect.height - 20, transition: "all 0.3s ease-out" }}
        >
          <DragLineSvg height={targetRect.height - 20} />
        </div>
      )}

      {/* Close top-right */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors z-30 pointer-events-auto"
        aria-label="Cerrar tutorial"
      >
        ✕
      </button>

      {/* Title + progress */}
      <div
        className="absolute left-0 right-0 text-center pointer-events-none px-4"
        style={headerAtBottom ? { bottom: 100 } : { top: 36 }}
      >
        <h2
          className="text-white font-bold leading-tight"
          style={{ textShadow: "0 2px 10px rgba(0,0,0,0.35)", fontSize: headerAtBottom ? "14px" : "18px" }}
        >
          {tutorialTitle}
        </h2>
        <div className="flex items-center justify-center gap-1.5 mt-2 pointer-events-auto">
          {steps.map((_, i) => {
            const isVisited = visitedSteps.has(i);
            const isActive = i === current;
            return (
              <button
                key={i}
                onClick={() => {
                  setVisitedSteps((prev) => new Set(prev).add(i));
                  setCurrent(i);
                }}
                className="rounded-full transition-all cursor-pointer flex items-center justify-center"
                style={{
                  width: isActive ? 20 : 14,
                  height: 14,
                  backgroundColor: isActive ? GREEN : isVisited ? GREEN : "rgba(255,255,255,0.35)",
                  border: "none",
                  opacity: isActive ? 1 : isVisited ? 0.7 : 0.5,
                }}
                aria-label={`Ir al paso ${i + 1}`}
              >
                {isVisited && !isActive && (
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step card */}
      <div
        className="absolute pointer-events-auto"
        style={{ top: cardTop, left: cardLeft, zIndex: 30, transition: "top 0.35s ease-out, left 0.35s ease-out" }}
      >
        <div key={`content-${current}`} className="bg-white rounded-2xl shadow-xl p-5" style={{ width: 270, animation: "tutorial-card-in 0.35s ease-out both" }}>
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: GREEN }}>
            Paso {current + 1} / {steps.length}
          </span>
          <h3 className="font-bold text-gray-800 text-base mt-1 mb-1">{step.title}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{step.text}</p>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={goPrev}
              className={`text-sm font-semibold transition-colors px-3 py-1.5 rounded-lg ${
                isFirst ? "text-gray-300 cursor-default" : "text-gray-600 hover:bg-gray-100"
              }`}
              disabled={isFirst}
            >
              ← Anterior
            </button>

            {isLast ? (
              <button
                onClick={handleFinish}
                className="text-white font-semibold text-sm px-5 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: GREEN }}
              >
                Finalizar
              </button>
            ) : (
              <button
                onClick={goNext}
                className="text-white font-semibold text-sm px-5 py-1.5 rounded-lg transition-colors"
                style={{ backgroundColor: GREEN }}
              >
                Siguiente →
              </button>
            )}
          </div>

          {autoShow && (
            <button
              onClick={handleSkip}
              className="mt-3 text-gray-400 hover:text-gray-600 text-xs underline underline-offset-2 transition-colors text-center block w-full"
            >
              ⏭ Saltar tutorial
            </button>
          )}

          {!autoShow && (
            <button
              onClick={onQuickGuide}
              className="mt-2 text-gray-400 hover:text-gray-600 text-xs underline underline-offset-2 transition-colors text-center block w-full"
            >
              📖 Ver guía rápida
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
