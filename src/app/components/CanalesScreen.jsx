import { Tv, Eye } from "lucide-react";
import { ScreenLayout } from "./ScreenLayout";
import { useI18n } from "../context/I18nContext";
import imgSalud from "../imports/FormacionTV/Salud.jpg";
import imgPortada from "../imports/FormacionTV/PortadaCanal.jpg";
import imgEmpresa from "../imports/FormacionTV/nuestraempresa.jpg";
import imgHuella from "../imports/FormacionTV/dejandohuella.jpg";
import imgPrimerDia from "../imports/FormacionTV/primerdia.jpg";
import imgCambioCultural from "../imports/FormacionTV/cambiocultural.jpg";

const CANAL_KEYS = {
  salud: "tv.channel.salud",
  "mi-dia": "tv.channel.miDia",
  bienvenida: "tv.channel.bienvenida",
  huella: "tv.channel.huella",
  "primer-dia": "tv.channel.primerDia",
  "cambio-cultural": "tv.channel.cambioCultural",
};

const CANALES = [
  { id: "salud", title: "Salud", image: imgSalud, views: 47 },
  { id: "mi-dia", title: "Mi Día en Adif", image: imgPortada, views: 94 },
  {
    id: "bienvenida",
    title: "Bienvenida a nuestra Empresa",
    image: imgEmpresa,
    views: 44,
  },
  { id: "huella", title: "Dejando Huella", image: imgHuella, views: 104 },
  {
    id: "primer-dia",
    title: "Mi Primer Día en Adif",
    image: imgPrimerDia,
    views: 85,
  },
  {
    id: "cambio-cultural",
    title: "Agentes del Cambio Cultural",
    image: imgCambioCultural,
    views: 25143,
  },
];

function formatViews(n) {
  if (n >= 1000) {
    return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1).replace(".", ",") + " K";
  }
  return n.toString();
}

export function CanalesScreen() {
  const { t } = useI18n();
  return (
    <ScreenLayout headerMode="back" backTitle={t("tv.title")} helpKey="canales">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-[#659B35] rounded-lg flex items-center justify-center text-white">
            <Tv size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {t("tv.title")}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t("tv.description")}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-3 pb-4">
        {CANALES.map((canal) => (
          <button
            key={canal.id}
            className="w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left active:opacity-90"
          >
            <div className="relative h-36">
              <img
                src={canal.image}
                alt={t(CANAL_KEYS[canal.id] ?? canal.title)}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="text-white font-bold text-base">
                  {t(CANAL_KEYS[canal.id] ?? canal.title)}
                </h3>
                <div className="flex items-center gap-1.5 text-white/80 text-xs mt-0.5">
                  <Eye size={14} />
                  <span>
                    {t("tv.views").replace("{views}", formatViews(canal.views))}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ScreenLayout>
  );
}
