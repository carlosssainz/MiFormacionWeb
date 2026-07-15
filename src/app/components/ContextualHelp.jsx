import { X, Check } from "lucide-react";
import { HELP_CONTENT } from "../data/helpContent";
import { useTutorial } from "../context/TutorialContext";

const HELP_TO_TUTORIAL_KEY = {
  settings: "ajustes",
  perfil: "perfil",
};

export function ContextualHelp({ helpKey, open, onClose, onStartTutorial }) {
  const { isComplete } = useTutorial();
  const content = HELP_CONTENT[helpKey];

  const tutorialKey = HELP_TO_TUTORIAL_KEY[helpKey] || helpKey;
  const tutorialDone = isComplete(tutorialKey);

  if (!content) return null;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
          onClick={onClose}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                {content.title}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 -mx-6 px-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-3 whitespace-pre-line">
                {content.text}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
              {onStartTutorial && (
                <>
                  <button
                    onClick={onStartTutorial}
                    className="w-full py-2.5 border-2 border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] hover:bg-[#659B35] hover:text-white dark:hover:bg-[#85C34A] dark:hover:text-gray-900 font-semibold rounded-xl transition-colors text-sm"
                  >
                    {tutorialDone ? "↻ Repetir tutorial interactivo" : "🎮 Iniciar tutorial interactivo"}
                  </button>
                  {tutorialDone && (
                    <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#65A83E]">
                      <Check size={12} />
                      Completado anteriormente
                    </div>
                  )}
                </>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
