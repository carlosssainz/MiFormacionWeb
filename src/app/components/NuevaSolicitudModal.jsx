import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "../context/I18nContext";

export function NuevaSolicitudModal({
  open,
  onClose,
  onSubmit,
  availableAreas,
  userName,
  defaultYear,
}) {
  const { t } = useI18n();
  const [area, setArea] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [year, setYear] = useState(defaultYear);

  if (!open) return null;

  const resetForm = () => {
    setArea("");
    setTitle("");
    setDescription("");
    setYear(defaultYear);
  };

  const handleSubmit = (isBorrador) => {
    if (!area || !title.trim() || !description.trim()) {
      alert(t("needs.fillAllFields"));
      return;
    }
    onSubmit({
      area,
      title: title.trim(),
      description: description.trim(),
      isBorrador,
      year,
    });
    resetForm();
    onClose();
  };

  const nextYear = defaultYear + 1;

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .modal-overlay { animation: fade-in 0.2s ease-out; }
        .modal-sheet  { animation: slide-up 0.3s ease-out; }
      `}</style>

      <div
        className="modal-overlay fixed inset-0 bg-black/40 z-40"
        onClick={handleCancel}
      />

      <div className="modal-sheet fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl max-h-[85vh] flex flex-col">
        {/* A. Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium transition-colors"
          >
            {t("cancel")}
          </button>
          <h2 className="text-base font-bold text-[#207041] dark:text-[#85C34A]">
            {t("needs.newRequest")}
          </h2>
          <div className="w-10" />
        </div>

        {/* B. Form fields */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <div className="relative">
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-3 py-3 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] border border-[#CCCCCC] dark:border-gray-600 pr-10 transition-shadow"
            >
              <option value="">{t("needs.selectArea")}</option>
              {availableAreas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              size={18}
            />
          </div>

          {/* Year selector */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => setYear(defaultYear)}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                year === defaultYear
                  ? "bg-white dark:bg-gray-600 text-[#207041] dark:text-[#85C34A] shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {t("needs.currentYear").replace("{year}", String(defaultYear))}
            </button>
            <button
              type="button"
              onClick={() => setYear(nextYear)}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-colors ${
                year === nextYear
                  ? "bg-white dark:bg-gray-600 text-[#207041] dark:text-[#85C34A] shadow-sm"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {t("needs.nextYear").replace("{year}", String(nextYear))}
            </button>
          </div>

          <input
            type="text"
            placeholder={t("needs.titlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-3 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] border border-[#CCCCCC] dark:border-gray-600 transition-shadow"
          />

          <textarea
            placeholder={t("needs.descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-3 py-3 bg-white dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] border border-[#CCCCCC] dark:border-gray-600 resize-none transition-shadow"
          />

          {/* C. Metadata */}
          <p className="text-xs text-gray-500 text-right -mt-2">
            {t("needs.requestedBy").replace("{userName}", userName)}
          </p>
        </div>

        {/* D. Footer buttons */}
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={() => handleSubmit(true)}
            className="flex-1 py-3 rounded-lg border-2 border-[#207041] text-[#207041] dark:border-[#85C34A] dark:text-[#85C34A] font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {t("needs.saveDraft")}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            className="flex-1 py-3 rounded-lg bg-[#659B35] hover:bg-[#207041] text-white font-semibold text-sm transition-colors shadow-sm"
          >
            {t("needs.sendRequest")}
          </button>
        </div>
      </div>
    </>
  );
}
