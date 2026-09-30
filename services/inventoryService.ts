import { withOfflineFallback } from './offilineSwitch';
import * as constant from '../constants/Constants';
import {
  Select_CI_Management_Catalogs
} from '../api/CIManagementAPI/CIManagementapi';
import {
  Select_Static_Catalogs_Options,
} from '../api/CatalogsAPI/StaticCatalogsapi';
import { Select_CatInv_Items } from '../api/CatInvItemsAPI/CatInvItemsapi';
import { Asset, Catalogs, Option } from '../app/components/types';

// 0 en cualquier id = sin cambio (el backend conserva el valor actual)
export type UpdatePayload = {
  assetNumber: string;
  idOrganization: number;
  idCenter: number;
  idLocation: number;
  idStatus: number;
  idPersonnal: number;
};
 
// Opciones de Select_CI_Management_Catalogs (las mismas que en web)
const CATALOG = { STATUS: 3, CENTER: 4, ORGANIZATION: 5 };
 
// Normaliza a { value: number, label: string } porque PaperSelect compara con ===
const toOptions = (rows: any[]): Option[] =>
  (rows || []).map((r) => ({ value: Number(r.value), label: String(r.label) }));
 
/* ============================== CATÁLOGOS ============================== */
 
async function getCatalog(option: number, token: string) {
  const res = await Select_CI_Management_Catalogs({ option }, token);
  return toOptions(res);
}
 
async function getStatusCatalog(token: string): Promise<Option[]> {
  const res = await Select_CI_Management_Catalogs({ option: CATALOG.STATUS }, token);
  if (!res || res.length === 0) return [];
 
  const data = await Select_Static_Catalogs_Options(
    { option: 0, idCatalog: res[0].value, searchValue: '', idType: 0 },
    token
  );
  return (data || []).map((o: any) => ({
    value: Number(o.idStaticCatalogOption),
    label: String(o.optionValue),
  }));
}
 
export async function getCatalogs(token: string, isOfflineMode: boolean): Promise<Catalogs> {
  return withOfflineFallback({
    isOfflineMode,
    online: async () => {
      const [organizations, centers, statuses] = await Promise.all([
        getCatalog(CATALOG.ORGANIZATION, token),
        getCatalog(CATALOG.CENTER, token),
        getStatusCatalog(token),
      ]);
      return { organizations, centers, statuses };
    },
    // TODO paso 4: leer de SQLite (guardados la última vez que hubo red)
    offline: async () => ({ organizations: MOCK_ORGS, centers: MOCK_CENTERS, statuses: MOCK_STATUS }),
  });
}
 
/* ============ LOCATIONS POR CENTRO (lógica de DropdownRelationalItems) ============ */
 
// Caché en memoria: si vuelves a elegir el mismo centro, no se consulta otra vez
const locationsCache = new Map<number, Option[]>();
 
export async function getLocationsByCenter(
  idCenter: number,
  token: string,
  isOfflineMode: boolean
): Promise<Option[]> {
  if (!idCenter) return [];
  if (locationsCache.has(idCenter)) return locationsCache.get(idCenter)!;
 
  const result: Option[] = await withOfflineFallback({
    isOfflineMode,
    online: async () => {
      const data = await Select_CatInv_Items(
        {
          option: 7,
          idCatInvItem: 0,
          idCatInv: constant.ID_CATINV_LOCATIONS_CATALOG,
          searchValue: String(idCenter),
        },
        token
      );
      // En web el valor que se guarda como idLocation es idCatInvItem (ver tu valueId)
      return (data || []).map((catOpt: any) => ({
        value: Number(catOpt.idCatInvItem),
        label: String(catOpt.alias),
      }));
    },
    // TODO paso 4: leer de SQLite
    offline: async () => MOCK_LOCATIONS[idCenter] ?? [],
  });
 
  locationsCache.set(idCenter, result);
  return result;
}
 
export const clearLocationsCache = () => locationsCache.clear();
 
/* ====================== GUARDADO (pendiente de sincronizar) ====================== */
 
export type SaveResult = { saved: number };
 
/**
 * Guarda los cambios en el dispositivo. NO los sube al servidor:
 * eso lo hará el botón de sincronizar (siguiente etapa).
 * TODO: insertar el payload en una tabla de pendientes de SQLite.
 */
export async function saveUpdates(payload: UpdatePayload[]): Promise<SaveResult> {
  await new Promise((r) => setTimeout(r, 300)); // simula escritura
  return { saved: payload.length };
}
 
/* ============================ DATOS DE EJEMPLO (offline) ============================ */
 
const MOCK_ORGS = [{ value: 1, label: 'CCSI' }, { value: 2, label: 'Operations' }];
const MOCK_CENTERS = [{ value: 1, label: 'Tijuana' }, { value: 2, label: 'Mexicali' }];
const MOCK_STATUS = [{ value: 1, label: 'Active' }, { value: 2, label: 'In repair' }, { value: 3, label: 'Retired' }];
const MOCK_LOCATIONS: Record<number, Option[]> = {
  1: [{ value: 11, label: 'TJ - Floor 1' }, { value: 12, label: 'TJ - Warehouse' }],
  2: [{ value: 21, label: 'MXL - Floor 1' }, { value: 22, label: 'MXL - IT Room' }],
};