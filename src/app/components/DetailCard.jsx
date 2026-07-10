export function DetailCard({ color, icon, title, subtitle, badges, action, children }) {
  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div
        className="border-t-4 bg-white dark:bg-gray-800 pt-4 flex-shrink-0"
        style={{ borderColor: color }}
      >
        <div className="px-4 pb-4">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
              style={{ backgroundColor: color }}
            >
              <span className="[&>svg]:w-8 [&>svg]:h-8">{icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badges && (
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-4">
              {badges}
            </div>
          )}
        </div>
      </div>

      {children && (
        <div className="overflow-y-auto flex-1 min-h-0 px-4 pb-4">
          <div className="bg-[#F5F5F5] dark:bg-gray-700 rounded-lg p-4">
            {children}
          </div>
        </div>
      )}

      {action && (
        <div className="border-t border-[#CCCCCC] dark:border-gray-700 px-4 py-4 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
