import { getDb } from '../database/index';
import { runDbWrite } from './dbQueue';

/* ============================================================================
   Sesión por INACTIVIDAD (online u offline).
   Se guarda la hora de la última actividad en sync_state; si pasan 30 minutos
   sin tocar la pantalla ni escanear, la sesión se cierra.
   ============================================================================ */

export const SESSION_MINUTES = 30;
const SESSION_KEY = 'session_last_activity';
const PERSIST_EVERY_MS = 60 * 1000; // no escribir en SQLite en cada toque, solo cada minuto

let lastActivity = 0;   // en memoria (se actualiza en cada toque/escaneo)
let lastPersisted = 0;  // última vez que se guardó en SQLite

const persistActivity = async (time: number) => {
  try {
    lastPersisted = time;
    await runDbWrite(async () => {
      const dbInstance = await getDb();
      await dbInstance.runAsync(
        `INSERT INTO sync_state (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [SESSION_KEY, String(time)]
      );
    });
  } catch (error) {
    console.error('Error al guardar actividad de sesión:', error);
  }
};

// Al iniciar sesión
export const sqlite_StartSession = async () => {
  lastActivity = Date.now();
  await persistActivity(lastActivity);
};

// En cada toque o escaneo: reinicia el conteo de inactividad
export const markActivity = () => {
  lastActivity = Date.now();
  if (lastActivity - lastPersisted >= PERSIST_EVERY_MS) {
    persistActivity(lastActivity);
  }
};

// Al mandar la app a segundo plano: guarda la última actividad sin esperar el minuto
export const flushActivity = async () => {
  if (lastActivity > lastPersisted) await persistActivity(lastActivity);
};

// 'none' = no hay sesión registrada, 'active' = vigente, 'expired' = 30 min sin actividad
export const getSessionStatus = async (): Promise<'none' | 'active' | 'expired'> => {
  try {
    let last = lastActivity;

    // Si la app se reinició, la memoria está vacía: se lee de SQLite
    if (!last) {
      const dbInstance = await getDb();
      const row = await dbInstance.getFirstAsync('SELECT value FROM sync_state WHERE key = ?', [SESSION_KEY]);
      last = row ? Number(row.value) || 0 : 0;
      lastActivity = last;
    }

    if (!last) return 'none';
    return Date.now() - last >= SESSION_MINUTES * 60 * 1000 ? 'expired' : 'active';
  } catch (error) {
    console.error('Error al revisar la sesión:', error);
    return 'active'; // ante un error de lectura no se saca al usuario
  }
};

// Al cerrar sesión (manual o por inactividad)
export const sqlite_ClearSession = async () => {
  lastActivity = 0;
  lastPersisted = 0;
  try {
    await runDbWrite(async () => {
      const dbInstance = await getDb();
      await dbInstance.runAsync('DELETE FROM sync_state WHERE key = ?', [SESSION_KEY]);
    });
  } catch (error) {
    console.error('Error al limpiar sesión:', error);
  }
};