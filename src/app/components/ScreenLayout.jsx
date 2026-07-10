import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";
import { TopHeader } from "./TopHeader";
import { BottomNav } from "./BottomNav";
import { ContextualHelp } from "./ContextualHelp";
import { useI18n } from "../context/I18nContext";
import { useAuth } from "../context/AuthContext";

export function ScreenLayout({
  children,
  headerMode = "none",
  backTitle,
  backSubtitle,
  onBack,
  scrollable = true,
  hideBottomNav = false,
  hideSearch = false,
  helpKey,
  title,
  onHelpClick,
}) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const { setGlobalSearchOpen } = useAuth();
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <div className="size-full bg-[#F5F5F5] dark:bg-gray-900 flex flex-col">
      {headerMode === "top" && (
        <TopHeader title={title} onHelpClick={onHelpClick} />
      )}

      {headerMode === "back" && (
        <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm min-h-[64px] flex items-center">
          <div className="w-11 shrink-0 flex items-center justify-center">
            <button
              onClick={onBack ?? (() => navigate(-1))}
              className="w-11 h-11 flex items-center justify-center text-[#659B35] hover:text-[#207041] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
              aria-label={t("back")}
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
            <div className="flex flex-col items-center min-w-0">
              {backTitle && (
                <h1 className="text-gray-700 dark:text-gray-200 text-lg font-semibold text-center truncate leading-tight w-full">
                  {backTitle}
                </h1>
              )}
              {backSubtitle && (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center leading-tight mt-1 truncate w-full">
                  {backSubtitle}
                </p>
              )}
            </div>
            {helpKey && (
              <button
                onClick={() => setHelpOpen(true)}
                className="w-7 h-7 rounded-full border border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] hover:bg-[#659B35] hover:text-white dark:hover:bg-[#85C34A] dark:hover:text-gray-900 flex items-center justify-center transition-colors shrink-0 text-xs font-bold"
                aria-label="Ayuda contextual"
              >
                ?
              </button>
            )}
          </div>
          <div className="w-11 shrink-0" />
        </div>
      )}

      {backSubtitle && headerMode !== "back" && (
        <div className="px-4 pt-3 pb-1">
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center">
            {backSubtitle}
          </p>
        </div>
      )}

      {scrollable ? (
        <div className="flex-1 overflow-y-scroll pb-16 scroll-container">
          <div className="min-h-[calc(100%+1px)]">
            {headerMode === "top" && !hideSearch && (
              <div className="px-4 py-1 flex items-center gap-2">
                <button
                  onClick={() => setGlobalSearchOpen(true)}
                  className="flex-1 flex items-center gap-2 h-8 px-3 rounded-lg bg-white dark:bg-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-colors text-left overflow-hidden"
                >
                  <Search size={14} className="shrink-0 text-gray-400" />
                  <span className="text-xs">Descubrir formación...</span>
                </button>
                {(onHelpClick || helpKey) && (
                  <button
                    onClick={onHelpClick ?? (() => setHelpOpen(true))}
                    className="w-8 h-8 rounded-full border border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] hover:bg-[#659B35] hover:text-white dark:hover:bg-[#85C34A] dark:hover:text-gray-900 flex items-center justify-center transition-colors shrink-0 text-xs font-bold"
                    aria-label="Ayuda contextual"
                  >
                    ?
                  </button>
                )}
              </div>
            )}
            {children}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {headerMode === "top" && !hideSearch && (
            <div className="px-4 py-1 flex items-center gap-2">
              <button
                onClick={() => setGlobalSearchOpen(true)}
                className="flex-1 flex items-center gap-2 h-8 px-3 rounded-lg bg-white dark:bg-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm transition-colors text-left overflow-hidden"
              >
                <Search size={14} className="shrink-0 text-gray-400" />
                <span className="text-xs">Descubrir formación...</span>
              </button>
              {(onHelpClick || helpKey) && (
                <button
                  onClick={onHelpClick ?? (() => setHelpOpen(true))}
                  className="w-8 h-8 rounded-full border border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] hover:bg-[#659B35] hover:text-white dark:hover:bg-[#85C34A] dark:hover:text-gray-900 flex items-center justify-center transition-colors shrink-0 text-xs font-bold"
                  aria-label="Ayuda contextual"
                >
                  ?
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      )}

      {!hideBottomNav && <BottomNav />}

      {headerMode === "back" && helpKey && (
        <ContextualHelp
          helpKey={helpKey}
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
        />
      )}
    </div>
  );
}
