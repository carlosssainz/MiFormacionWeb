import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  Mail,
  MessageCircle,
  Phone,
  GraduationCap,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
} from "lucide-react";
import { CURRENT_USER_NAME, CURRENT_USER_PROFILE } from "../data/mockData";
import perfilImg from "../imports/foto (7).jpg";
import { ScreenLayout } from "./ScreenLayout";
import { ContextualHelp } from "./ContextualHelp";
import { useAuth } from "../context/AuthContext";
import { useI18n } from "../context/I18nContext";

export function ProfileScreen() {
  const { role, logout } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [contactosOpen, setContactosOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const p = CURRENT_USER_PROFILE;

  return (
    <ScreenLayout scrollable={false}>
      <div className="bg-white dark:bg-gray-800 px-4 py-4 shadow-sm min-h-[64px] flex items-center">
        <div className="w-11 shrink-0 flex items-center justify-center">
          <button
            onClick={() => navigate(-1)}
            className="w-11 h-11 flex items-center justify-center text-[#659B35] hover:text-[#207041] hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            aria-label={t("back")}
          >
            <ChevronLeft size={24} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 min-w-0">
          <div className="flex flex-col items-center min-w-0">
            <h1 className="text-gray-700 dark:text-gray-200 text-lg font-semibold text-center truncate leading-tight w-full">
              {t("profile.title")}
            </h1>
          </div>
          <button
            onClick={() => setHelpOpen(true)}
            className="w-7 h-7 rounded-full border border-[#659B35] dark:border-[#85C34A] text-[#659B35] dark:text-[#85C34A] hover:bg-[#659B35] hover:text-white dark:hover:bg-[#85C34A] dark:hover:text-gray-900 flex items-center justify-center transition-colors shrink-0 text-xs font-bold"
            aria-label={t("settings.help")}
          >
            ?
          </button>
        </div>
        <div className="w-11 shrink-0" />
      </div>

      <div className="flex-1 overflow-y-scroll pb-16 scroll-container">
        <div className="min-h-[calc(100%+1px)]">
        <div className="bg-white dark:bg-gray-800 px-4 pt-8 pb-6 mb-3 rounded-b-2xl">
          <div className="flex flex-col items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden mb-4 ring-4 ring-[#659B35]/30 shadow-lg">
                <img
                  src={perfilImg}
                  alt={t("profile.photoAlt")}
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">
                {CURRENT_USER_NAME}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {role === "formador" ? t("header.trainer") : t("header.student")}
              </p>
              <div
                className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  role === "formador"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-[#F5F5F5] text-[#659B35] dark:bg-gray-700 dark:text-[#85C34A]"
                }`}
              >
                <GraduationCap size={14} />
                {role === "formador" ? t("header.trainer") : t("header.student")}
              </div>
            </div>
          </div>

        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-4 px-4 py-4 mb-4 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 hover:border-[#659B35]/40 dark:hover:border-[#85C34A]/40 transition-all text-left group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#659B35] dark:bg-[#85C34A] flex items-center justify-center shrink-0 group-hover:bg-[#207041] dark:group-hover:bg-[#006633] transition-colors">
            <Settings size={22} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {t("settings.title")}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {t("settings.appearance")} &middot; {t("settings.languages")}
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400 shrink-0" />
        </button>

        <div className="bg-white dark:bg-gray-800 px-4 py-4 mb-4">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 uppercase tracking-wide">
            {t("profile.employeeProfile")}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <Field label={t("profile.id")} value={p.matricula} />
            <Field label={t("profile.company")} value={p.empresa} />
            <Field label={t("profile.mainUnit")} value={p.unidadPrincipal} />
            <Field label={t("profile.orgUnit")} value={p.unidadOrganizativa} />
            <Field label={t("profile.group")} value={p.colectivo} />
            <Field label={t("profile.position")} value={p.cargo} />
            <Field label={t("profile.role")} value={p.posicion} />
            <Field label={t("profile.job")} value={p.puesto} />
            <div className="col-span-2">
              <Field
                label={t("profile.lastAccess")}
                value={p.ultimoAcceso}
                icon={<Calendar size={14} className="text-gray-400" />}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 px-4 py-4 mb-4">
          <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 uppercase tracking-wide">
            {t("profile.contactInfo")}
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div className="col-span-2">
              <Field
                label={t("profile.email")}
                value={p.emailCorporativo}
                icon={<Mail size={14} className="text-gray-400" />}
                isLink
              />
            </div>
            <Field
              label={t("profile.internalPhone")}
              value={p.fijoInterior}
              icon={<Phone size={14} className="text-gray-400" />}
            />
            <Field
              label={t("profile.externalPhone")}
              value={p.fijoExterior}
              icon={<Phone size={14} className="text-gray-400" />}
            />
            <Field
              label={t("profile.internalMobile")}
              value={p.movilInterior}
              icon={<Phone size={14} className="text-gray-400" />}
            />
            <Field
              label={t("profile.externalMobile")}
              value={p.movilExterior}
              icon={<Phone size={14} className="text-gray-400" />}
            />
            <div className="col-span-2">
              <Field
                label={t("profile.residence")}
                value={p.residencia}
                icon={<MapPin size={14} className="text-gray-400" />}
              />
            </div>
            <div className="col-span-2">
              <Field label={t("profile.address")} value={p.direccion} />
            </div>
            <div className="col-span-2 grid grid-cols-3 gap-x-4">
              <Field label={t("profile.city")} value={p.poblacion} />
              <Field label={t("profile.province")} value={p.provincia} />
              <Field label={t("profile.zipCode")} value={p.cp} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 px-4 py-4 mb-4">
          <button
            onClick={() => setContactosOpen(!contactosOpen)}
            className="w-full text-sm font-bold text-center bg-[#207041] dark:bg-[#006633] text-white py-2 rounded-lg uppercase tracking-wide flex items-center justify-center gap-2 hover:bg-[#185a33] dark:hover:bg-[#004d26] transition-colors"
          >
            {t("profile.keyContacts")}
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${contactosOpen ? "rotate-180" : ""}`}
            />
          </button>

          {contactosOpen && (
            <>
              <div className="mt-4 mb-4 pb-4 border-b border-[#CCCCCC] dark:border-gray-700">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("profile.trainingValidator")}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({p.validadorFormacionId}) {p.validadorFormacion}
                    </span>
                  </div>
                  <ContactActions nombre={p.validadorFormacion} />
                </div>
              </div>

              <div className="mb-4 pb-4 border-b border-[#CCCCCC] dark:border-gray-700">
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("profile.hrContact")}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({p.interlocutorRRHHId}) {p.interlocutorRRHH}
                    </span>
                  </div>
                  <ContactActions nombre={p.interlocutorRRHH} />
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t("profile.trainingManagers")}
                </h3>
                {p.responsablesFormacion.map((nombre, idx) => (
                  <div
                    key={idx}
                    className={
                      idx < p.responsablesFormacion.length - 1
                        ? "flex items-center justify-between mb-3"
                        : "flex items-center justify-between"
                    }
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {nombre}
                      </span>
                    </div>
                    <ContactActions nombre={nombre} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={logout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            {t("profile.logout")}
          </button>
        </div>

        <div className="text-center py-4 text-xs text-gray-500">
          {t("profile.copyright")}
        </div>
        </div>
      </div>

      <ContextualHelp
        helpKey="perfil"
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
      />
    </ScreenLayout>
  );
}

function ContactActions({ nombre }) {
  const { t } = useI18n();
  const email =
    nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, ".") + "@adif.es";
  const teamsUser = encodeURIComponent(nombre);
  return (
    <div className="flex items-center gap-2">
      <a
        href={`mailto:${email}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#659B35] transition-colors"
        title={t("profile.sendEmail")}
      >
        <Mail size={18} />
      </a>
      <a
        href={`https://teams.microsoft.com/l/chat/0/0?users=${teamsUser}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-[#659B35] transition-colors"
        title={t("profile.openChat")}
      >
        <MessageCircle size={18} />
      </a>
    </div>
  );
}

function Field({ label, value, icon, isLink }) {
  return (
    <div>
      <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs block mb-0.5">
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        {icon}
        {isLink ? (
          <a
            href={`mailto:${value}`}
            className="text-gray-600 dark:text-gray-400 hover:text-[#659B35] transition-colors"
          >
            {value}
          </a>
        ) : (
          <span className="text-gray-600 dark:text-gray-400">{value}</span>
        )}
      </div>
    </div>
  );
}
