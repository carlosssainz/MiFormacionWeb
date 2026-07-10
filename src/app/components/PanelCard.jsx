export function PanelCard({
  icon,
  iconColor = "#659B35",
  title,
  description,
  className = "",
  badges,
  statusBadge,
  indicator,
  action,
  onClick,
  completed = false,
  borderTop = false,
  borderTopColor,
  children,
}) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden text-left transition-colors ${
        onClick ? "hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer" : ""
      } ${completed ? "opacity-80" : ""} ${borderTop ? "border-t-4" : ""} ${className}`}
      style={borderTop && borderTopColor ? { borderTopColor } : undefined}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {icon && (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 relative"
              style={{ backgroundColor: iconColor }}
            >
              {icon}
              {indicator && (
                <div className="absolute -top-1.5 -right-1.5">{indicator}</div>
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm leading-snug">
                {title}
              </h3>
              {statusBadge && <div className="shrink-0">{statusBadge}</div>}
            </div>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}
            {badges && (
              <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px]">
                {badges}
              </div>
            )}
            {children}
          </div>
        </div>
      </div>

      {action && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-4 py-2.5">
          {action}
        </div>
      )}
    </Wrapper>
  );
}
