import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { SUGERENCIAS } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

export function SugerenciasScreen() {
  const { t, formatDate } = useI18n();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sugerencias, setSugerencias] = useState(SUGERENCIAS);
  const [activeTab, setActiveTab] = useState("listado");

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    const nueva = {
      id: sugerencias.length + 1,
      title: title.trim(),
      description: description.trim(),
      fecha: formatDate(new Date()),
      estado: "pendiente",
    };
    setSugerencias((prev) => [nueva, ...prev]);
    setTitle("");
    setDescription("");
    setActiveTab("listado");
  };

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("suggestions.title")}
      helpKey="sugerencias"
    >
      <div className="px-4 pt-2 pb-3">
        <div className="flex border-b border-[#CCCCCC] dark:border-gray-700 gap-4">
          <button
            onClick={() => setActiveTab("listado")}
            className={`relative pb-2 text-sm font-semibold transition-colors ${activeTab === "listado" ? "text-[#207041] dark:text-[#85C34A]" : "text-gray-500 dark:text-gray-400"}`}
          >
            {t("suggestions.mySuggestions")}
            {activeTab === "listado" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#207041] dark:bg-[#85C34A] rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("enviar")}
            className={`relative pb-2 text-sm font-semibold transition-colors ${activeTab === "enviar" ? "text-[#207041] dark:text-[#85C34A]" : "text-gray-500 dark:text-gray-400"}`}
          >
            {t("suggestions.send")}
            {activeTab === "enviar" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#207041] dark:bg-[#85C34A] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {activeTab === "enviar" ? (
        <div className="px-4 space-y-4 pb-4">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              {t("suggestions.titleLabel")}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("suggestions.titlePlaceholder")}
              className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A] shadow-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
              {t("suggestions.description")}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("suggestions.descriptionPlaceholder")}
              rows={5}
              className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-[#CCCCCC] dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E3EB7A] dark:focus:ring-[#E3EB7A] shadow-sm resize-none"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim()}
            className="w-full bg-[#659B35] hover:bg-[#207041] dark:bg-[#85C34A] dark:hover:bg-[#006633] text-white rounded-xl p-3 font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            {t("suggestions.sendButton")}
          </button>
        </div>
      ) : (
        <div className="px-4 space-y-3 pb-4">
          {sugerencias.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">
              {t("suggestions.noResults")}
            </p>
          ) : (
            sugerencias.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#659B35] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <MessageSquare size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                      {s.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {s.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          s.estado === "respondida"
                            ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40"
                            : s.estado === "enviada"
                              ? "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/40"
                              : "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900/40"
                        }`}
                      >
                        {s.estado === "respondida"
                          ? t("suggestions.answered")
                          : s.estado === "enviada"
                            ? t("suggestions.sent")
                            : t("suggestions.pending")}
                      </span>
                      <span className="text-[10px] text-gray-400 dark:text-gray-500">
                        {s.fecha}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </ScreenLayout>
  );
}
