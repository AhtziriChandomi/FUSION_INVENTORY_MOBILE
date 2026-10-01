import {
  Select_CI_Management_Catalogs
} from '../api/CIManagementAPI/CIManagementapi';
import {
  Select_Static_Catalogs_Options,
} from '../api/CatalogsAPI/StaticCatalogsapi';
import { Select_CatInv_Items } from '../api/CatInvItemsAPI/CatInvItemsapi';
import { app_Sync_Asset_Updates } from '../api/AppInventoryAPI/AppInventoryapi';
import { Catalogs, Option } from '../app/components/types';
import * as constant from '../constants/Constants';
import { CATALOG_TYPE, sqlite_SaveCatalog, sqlite_SelectCatalog } from './catalogService';
import { withOfflineFallback } from './offilineSwitch';
import {
  PendingRow,
  sqlite_CountPendingUpdates,
  sqlite_DeleteErrorUpdates,
  sqlite_DeletePendingUpdates,
  sqlite_InsertPendingUpdates,
  sqlite_MarkPendingError,
  sqlite_SelectPendingUpdates,
  sqlite_CountPendingByBatch,
} from './pendingUpdateService';

// Respuesta de app_Sync_Asset_Updates por cada idPending
type SyncItemResult = {
  idPending: number;
  result?: number | string;
  success?: boolean;
  message?: string;
};
// 0 en cualquier id = sin cambio (el backend conserva el valor actual)
export type UpdatePayload = {
  assetNumber: string;
  idOrganization: number;
  idCenter: number;
  idLocation: number;
  idStatus: number;
  idPersonnal: number;
  summary: string; // texto legible para mostrar en la pantalla de sincronización
};

// Opciones de Select_CI_Management_Catalogs (las mismas que en web)
const CATALOG = { STATUS: 3, CENTER: 4, ORGANIZATION: 5 };

// Normaliza a { value: number, label: string } porque PaperSelect compara con ===.
// Tus APIs regresan '' cuando fallan, por eso se valida que sea arreglo.
const toOptions = (rows: any): Option[] =>
  Array.isArray(rows) ? rows.map((r) => ({ value: Number(r.value), label: String(r.label) })) : [];

/* ============================== CATÁLOGOS ============================== */

async function fetchCatalog(option: number, token: string): Promise<Option[]> {
  const res = await Select_CI_Management_Catalogs({ option }, token);
  return toOptions(res);
}

async function fetchStatusCatalog(token: string): Promise<Option[]> {
  const res = await Select_CI_Management_Catalogs({ option: CATALOG.STATUS }, token);
  if (!Array.isArray(res) || res.length === 0) return [];

  const data = await Select_Static_Catalogs_Options(
    { option: 0, idCatalog: res[0].value, searchValue: '', idType: 0 },
    token
  );
  return Array.isArray(data)
    ? data.map((o: any) => ({ value: Number(o.idStaticCatalogOption), label: String(o.optionValue) }))
    : [];
}

async function fetchLocations(idCenter: number, token: string): Promise<Option[]> {
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
  return Array.isArray(data)
    ? data.map((catOpt: any) => ({ value: Number(catOpt.idCatInvItem), label: String(catOpt.alias) }))
    : [];
}

// Si la API no regresó nada (falla de red), usa lo último guardado en SQLite
async function onlineOrCached(type: string, fetched: Option[], parentId = 0): Promise<Option[]> {
  if (fetched.length > 0) {
    await sqlite_SaveCatalog(type, fetched, parentId);
    return fetched;
  }
  return sqlite_SelectCatalog(type, parentId);
}

/**
 * Online: consulta la API, guarda en SQLite y descarga en segundo plano las
 *         locations de todos los centros para tenerlas disponibles offline.
 * Offline: lee lo último guardado en SQLite.
 */
export async function getCatalogs(token: string, isOfflineMode: boolean): Promise<Catalogs> {
  return withOfflineFallback({
    isOfflineMode,
    online: async () => {
      const [orgs, centersApi, statusApi] = await Promise.all([
        fetchCatalog(CATALOG.ORGANIZATION, token),
        fetchCatalog(CATALOG.CENTER, token),
        fetchStatusCatalog(token),
      ]);

      const [organizations, centers, statuses] = await Promise.all([
        onlineOrCached(CATALOG_TYPE.ORGANIZATION, orgs),
        onlineOrCached(CATALOG_TYPE.CENTER, centersApi),
        onlineOrCached(CATALOG_TYPE.STATUS, statusApi),
      ]);

      // No se espera: la pantalla no se detiene mientras se descargan las locations
      cacheAllLocations(centers, token);

      return { organizations, centers, statuses };
    },
    offline: async () => {
      const [organizations, centers, statuses] = await Promise.all([
        sqlite_SelectCatalog(CATALOG_TYPE.ORGANIZATION),
        sqlite_SelectCatalog(CATALOG_TYPE.CENTER),
        sqlite_SelectCatalog(CATALOG_TYPE.STATUS),
      ]);
      return { organizations, centers, statuses };
    },
  });
}

/* ============ LOCATIONS POR CENTRO (lógica de DropdownRelationalItems) ============ */

// Caché en memoria: si vuelves a elegir el mismo centro, no se consulta otra vez
const locationsCache = new Map<number, Option[]>();
let cachingLocations = false;

// Descarga y guarda las locations de cada centro, de 5 en 5
async function cacheAllLocations(centers: Option[], token: string) {
  if (cachingLocations) return;
  cachingLocations = true;
  try {
    for (let i = 0; i < centers.length; i += 5) {
      await Promise.all(
        centers.slice(i, i + 5).map(async (c) => {
          const locs = await fetchLocations(c.value, token);
          if (locs.length > 0) {
            await sqlite_SaveCatalog(CATALOG_TYPE.LOCATION, locs, c.value);
            locationsCache.set(c.value, locs);
          }
        })
      );
    }
  } catch (e) {
    console.log('Error caching locations', e);
  } finally {
    cachingLocations = false;
  }
}

export async function getLocationsByCenter(
  idCenter: number,
  token: string,
  isOfflineMode: boolean
): Promise<Option[]> {
  if (!idCenter) return [];
  if (locationsCache.has(idCenter)) return locationsCache.get(idCenter)!;

  const result: Option[] = await withOfflineFallback({
    isOfflineMode,
    online: async () => onlineOrCached(CATALOG_TYPE.LOCATION, await fetchLocations(idCenter, token), idCenter),
    offline: async () => sqlite_SelectCatalog(CATALOG_TYPE.LOCATION, idCenter),
  });

  if (result.length > 0) locationsCache.set(idCenter, result);
  return result;
}

export const clearLocationsCache = () => locationsCache.clear();

/* ====================== GUARDADO (pendiente de sincronizar) ====================== */

export type SaveResult = { saved: number; idBatch: string };

// Guarda en SQLite. No sube nada: eso lo hace syncPending() con el botón de sincronizar.
export async function saveUpdates(payload: UpdatePayload[]): Promise<SaveResult> {
  const idBatch = String(Date.now());
  const saved = await sqlite_InsertPendingUpdates(payload, idBatch);
  notifyPendingChanges();
  return { saved, idBatch };
}

/* ================================ SINCRONIZACIÓN ================================ */

// Activos por petición. Bloques chicos = la barra de progreso avanza de forma visible.
const SYNC_CHUNK = 10;

export type SyncProgress = {
  done: number;      // activos ya procesados
  total: number;     // activos a sincronizar
  updated: number;   // actualizados hasta ahora
  failed: number;    // no existe / error / otro hasta ahora
};

export type SyncOutcome = 'updated' | 'notfound' | 'error' | 'other';

export type SyncDetail = {
  idPending: number;
  assetNumber: string;
  summary: string;
  outcome: SyncOutcome;
  message: string;
};

export type SyncResult = {
  total: number;
  counts: Record<SyncOutcome, number>;
  details: SyncDetail[];
  aborted?: string;
};

/* -------- Aviso de cambios en pendientes (para el contador de la pestaña Sync) -------- */
type PendingListener = () => void;
const pendingListeners = new Set<PendingListener>();

export const subscribePendingChanges = (listener: PendingListener) => {
  pendingListeners.add(listener);
  return () => { pendingListeners.delete(listener); };
};

const notifyPendingChanges = () => {
  pendingListeners.forEach((listener) => {
    try { listener(); } catch (e) { console.log('Pending listener error', e); }
  });
};

export const getPendingCount = () => sqlite_CountPendingUpdates();
export const getBatchPendingCount = (idBatch: string) => sqlite_CountPendingByBatch(idBatch);
export const getPendingList = (): Promise<PendingRow[]> => sqlite_SelectPendingUpdates();

export const discardPending = async (idPending: number) => {
  await sqlite_DeletePendingUpdates([idPending]);
  notifyPendingChanges();
};

export const discardErrors = async () => {
  await sqlite_DeleteErrorUpdates();
  notifyPendingChanges();
};

/**
 * ⚠️ Traduce la respuesta de tu API a un resultado. Ajusta los códigos
 * a los que regrese tu SP.
 */
function toOutcome(r?: SyncItemResult): SyncOutcome {
  if (!r) return 'other';
  const code = String(r.result ?? '').toUpperCase();
  if (code === '1' || code === 'UPDATED' || (r.result === undefined && r.success === true)) return 'updated';
  if (code === '2' || code === 'NOT_FOUND' || code === 'NOTFOUND') return 'notfound';
  if (code === '3' || code === 'ERROR' || (r.result === undefined && r.success === false)) return 'error';
  return 'other';
}

const DEFAULT_MESSAGE: Record<SyncOutcome, string> = {
  updated: 'Updated',
  notfound: 'Asset number does not exist',
  error: 'Error while updating',
  other: 'No response from server',
};

/**
 * Sube todos los pendientes (incluye los que fallaron antes) en bloques.
 * - Actualizados: se borran de SQLite.
 * - No existe / error / otro: quedan en SQLite con su resultado y mensaje.
 * - Si se cae la conexión, se detiene; lo no enviado sigue pendiente y
 *   aparece en el detalle como "Other · Not sent".
 * Regresa el detalle de cada activo para mostrarlo en pantalla.
 */
export async function syncPending(token: string, onProgress?: (p: SyncProgress) => void): Promise<SyncResult> {
  const rows = await sqlite_SelectPendingUpdates();
  const total = rows.length;
  const details: SyncDetail[] = [];
  let aborted: string | undefined;

  let updatedSoFar = 0;
  let failedSoFar = 0;

  onProgress?.({ done: 0, total, updated: 0, failed: 0 });

  for (let i = 0; i < total; i += SYNC_CHUNK) {
    const chunk = rows.slice(i, i + SYNC_CHUNK);

    // Como tus demás APIs, si falla la conexión regresa '' en lugar de un arreglo
    let results: SyncItemResult[] | '' = '';
    try {
      results = await app_Sync_Asset_Updates(chunk, token);
    } catch (e) {
      results = '';
    }

    if (!Array.isArray(results)) {
      aborted = 'Connection lost. Items not sent are still pending.';
      for (const row of rows.slice(i)) {
        details.push({
          idPending: row.idPending, assetNumber: row.assetNumber, summary: row.summary,
          outcome: 'other', message: 'Not sent (connection lost)',
        });
      }
      break;
    }

    const byId = new Map(results.map((r) => [Number(r.idPending), r]));
    const okIds: number[] = [];

    for (const row of chunk) {
      const r = byId.get(row.idPending);
      const outcome = toOutcome(r);
      const message = r?.message || DEFAULT_MESSAGE[outcome];

      if (outcome === 'updated') okIds.push(row.idPending);
      else await sqlite_MarkPendingError(row.idPending, outcome, message);

      details.push({ idPending: row.idPending, assetNumber: row.assetNumber, summary: row.summary, outcome, message });
    }

    await sqlite_DeletePendingUpdates(okIds);

    updatedSoFar += okIds.length;
    failedSoFar += chunk.length - okIds.length;
    onProgress?.({ done: Math.min(i + SYNC_CHUNK, total), total, updated: updatedSoFar, failed: failedSoFar });
  }

  notifyPendingChanges();

  const counts: Record<SyncOutcome, number> = { updated: 0, notfound: 0, error: 0, other: 0 };
  details.forEach((d) => counts[d.outcome]++);

  return { total, counts, details, aborted };
}