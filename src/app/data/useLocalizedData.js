import { useI18n } from "../context/I18nContext";
import * as esData from "./mockData_es";
import * as caData from "./mockData_ca";
import * as euData from "./mockData_eu";
import * as glData from "./mockData_gl";
import * as vaData from "./mockData_va";
import * as ocData from "./mockData_oc";

const dataMap = {
  es: esData,
  ca: caData,
  eu: euData,
  gl: glData,
  va: vaData,
  oc: ocData,
};

export function useLocalizedData() {
  const { locale } = useI18n();
  return dataMap[locale] ?? esData;
}
