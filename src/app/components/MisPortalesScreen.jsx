import { ScreenLayout } from "./ScreenLayout";
import { PORTALES } from "../data/mockData";
import {
  Globe,
  ArrowRight,
  User,
  Building2,
  GraduationCap,
  Monitor,
  PenSquare,
  Shield,
  FileText,
  Video,
  Handshake,
  Wrench,
} from "lucide-react";
import { useI18n } from "../context/I18nContext";

const PORTAL_ICONS = {
  "Portal del Empleado": <User size={22} />,
  "Intranet Corporativa": <Building2 size={22} />,
  "Centro de Formación Virtual": <GraduationCap size={22} />,
  "Sede Electrónica": <Monitor size={22} />,
  "Portal de Firmas": <PenSquare size={22} />,
  "Oficina Técnica de Seguridad": <Shield size={22} />,
  "Sistema de Gestión Documental": <FileText size={22} />,
  "Aula Virtual Corporativa": <Video size={22} />,
  "Portal de Proveedores": <Handshake size={22} />,
  "Gestión de Incidencias TI": <Wrench size={22} />,
};

const PORTAL_KEYS = {
  "Portal del Empleado": "portals.employeePortal",
  "Intranet Corporativa": "portals.intranet",
  "Centro de Formación Virtual": "portals.trainingCenter",
  "Sede Electrónica": "portals.electronicOffice",
  "Portal de Firmas": "portals.signaturePortal",
  "Oficina Técnica de Seguridad": "portals.securityOffice",
  "Sistema de Gestión Documental": "portals.documentManagement",
  "Aula Virtual Corporativa": "portals.virtualClassroom",
  "Portal de Proveedores": "portals.supplierPortal",
  "Gestión de Incidencias TI": "portals.incidentManagement",
};

export function MisPortalesScreen() {
  const { t } = useI18n();
  return (
    <ScreenLayout
      headerMode="back"
      backTitle={t("portals.title")}
      helpKey="mis-portales"
    >
      <div className="px-4 py-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#006633]/10 dark:bg-[#85C34A]/10 rounded-2xl mb-3">
            <Globe size={32} className="text-[#006633] dark:text-[#85C34A]" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {t("portals.access")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t("portals.description")}
          </p>
        </div>

        <div className="grid gap-3">
          {PORTALES.map((p, i) => (
            <button
              key={i}
              className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-[#006633]/5 dark:hover:bg-[#85C34A]/10 transition-all text-left group"
            >
              <div className="flex-shrink-0 w-11 h-11 bg-gradient-to-br from-[#006633] to-[#207041] dark:from-[#85C34A] dark:to-[#006633] rounded-xl flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                {PORTAL_ICONS[p.portal]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">
                  {t(PORTAL_KEYS[p.portal] || p.portal)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-mono">
                  {p.nombreWeb}
                </p>
              </div>
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 group-hover:bg-[#006633] group-hover:text-white dark:group-hover:bg-[#85C34A] dark:group-hover:text-gray-900 transition-colors">
                <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </ScreenLayout>
  );
}
