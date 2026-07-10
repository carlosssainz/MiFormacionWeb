import { SearchX, Inbox } from "lucide-react";
import { useI18n } from "../context/I18nContext";

export function EmptyState({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400 px-4 text-center">
      <div className="mb-2 opacity-50">{icon ?? <Inbox size={48} />}</div>
      <p className="text-sm font-medium">{title}</p>
      {description && (
        <p className="text-xs mt-1 text-gray-400">{description}</p>
      )}
    </div>
  );
}

export function SearchEmptyState({ query }) {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-400 px-4 text-center">
      <SearchX size={36} className="mb-2 opacity-50" />
      <p className="text-sm">
        {t("emptyState.noResults").replace("{query}", query)}
      </p>
      <p className="text-xs mt-1">{t("emptyState.tryOtherTerms")}</p>
    </div>
  );
}
