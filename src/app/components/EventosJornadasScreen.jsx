import { Calendar, MapPin } from "lucide-react";
import { useState } from "react";
import { ScreenLayout } from "./ScreenLayout";
import { PanelCard } from "./PanelCard";
import { DetailCard } from "./DetailCard";
import { PopupOverlay } from "./PopupOverlay";
import { EmptyState } from "./EmptyState";
import { EVENTOS_JORNADAS } from "../data/mockData";
import { useI18n } from "../context/I18nContext";

export function EventosJornadasScreen() {
  const { t } = useI18n();
  const [selectedEventoId, setSelectedEventoId] = useState(null);

  const selectedEvento =
    selectedEventoId !== null
      ? EVENTOS_JORNADAS.find((e) => e.id === selectedEventoId)
      : null;

  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("events.title")}
      helpKey="eventos-jornadas"
    >
      <div className="px-4 space-y-3 pb-4">
        {EVENTOS_JORNADAS.length === 0 ? (
          <EmptyState
            icon={<Calendar size={48} />}
            title="No hay eventos o jornadas disponibles"
          />
        ) : (
          EVENTOS_JORNADAS.map((e) => (
            <PanelCard
              key={e.id}
              icon={<Calendar size={20} />}
              iconColor="#659B35"
              title={e.title}
              description={e.description}
              onClick={() => setSelectedEventoId(e.id)}
              badges={
                <>
                  <span className="font-medium text-[#659B35] dark:text-[#85C34A] bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                    {e.tipo}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <Calendar size={10} /> {e.fecha}
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <MapPin size={10} /> {e.ubicacion}
                  </span>
                </>
              }
            />
          ))
        )}
      </div>

      <PopupOverlay
        open={!!selectedEvento}
        onClose={() => setSelectedEventoId(null)}
      >
        {selectedEvento &&
          (() => {
            return (
              <DetailCard
                color="#659B35"
                icon={<Calendar size={32} />}
                title={selectedEvento.title}
                badges={
                  <>
                    <span className="text-xs font-medium text-[#659B35] dark:text-[#85C34A] bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                      {selectedEvento.tipo}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-xs">
                      <Calendar size={12} /> {selectedEvento.fecha}
                    </span>
                    {selectedEvento.ubicacion && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1 text-xs">
                          <MapPin size={12} /> {selectedEvento.ubicacion}
                        </span>
                      </>
                    )}
                  </>
                }
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {selectedEvento.description}
                </p>
              </DetailCard>
            );
          })()}
      </PopupOverlay>
    </ScreenLayout>
  );
}
