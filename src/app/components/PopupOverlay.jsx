import { X } from "lucide-react";
import { useEffect, useState } from "react";

export function PopupOverlay({ open, onClose, children }) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      requestAnimationFrame(() => setAnimating(true));
    } else {
      setAnimating(false);
      const timer = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        animating
          ? "bg-black/30 backdrop-blur-[1px]"
          : "bg-black/0 backdrop-blur-none"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10 w-full max-w-lg max-h-[85vh] flex flex-col transition-all duration-200 ${
          animating ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-red-500 hover:bg-red-600 shadow-md flex items-center justify-center text-white transition-colors z-10"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col flex-1 min-h-0">
          {children}
        </div>
      </div>
    </div>
  );
}
