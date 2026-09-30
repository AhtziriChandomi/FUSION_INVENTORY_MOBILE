
import { getDb } from '../database/index';

// -------------------------
// Sync State (helper)
// -------------------------
export const sqlite_SetSyncsState = async (key, value) => {
    try{
        const dbInstance = await getDb();

        await dbInstance.runAsync(
            `   INSERT INTO sync_state (key, value)
                VALUES (?, ?)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value
            `,
            [key, value]
        );      
        
        return {status: 'success'};
    }catch(error){
        console.error('Error al insertar/actualizar sync_state:', error);
        return {status: 'error', message: 'Error guardando sync_state'};
    }
};

export const sqlite_GetSyncsState = async (key) => {
  try {
    const dbInstance = await getDb();

    const row = await dbInstance.getFirstAsync(
      `SELECT value FROM sync_state WHERE key = ?`,
      [key]
    );

    return { status: 'success', value: row ? row.value : null };
  } catch (error) {
    console.error('Error al obtener sync_state:', error);
    return { status: 'error', message: 'Error obteniendo sync_state', value: null };
  }
};

export const sqlite_QueueAdd = async ({entity, action, payload}) => {
    try{
        const dbInstance =  await getDb();

        const result = await dbInstance.runAsync(
            `
            INSERT INTO sync_queue (entity, action, payload, status, createdAt)
            VALUES (?, ?, ?, 'PENDING', datetime('now'))
            `,
            [
                String(entity), 
                String(action), 
                JSON.stringify(payload ?? {})
            ]
        );

        return {status: 'success', id: result.lastInsertRowId};
    }catch(error){
        console.error('Error al insertar en sync_queue:', error);
        return {status: 'error', message: 'Error insertando en sync_queue'};
    }
};

export const sqlite_QueueGetPending = async (limit = 50) => {
    try {
        const dbInstance = await getDb();

        const rows = await dbInstance.getAllAsync(
        `
        SELECT id, entity, action, payload, createdAt, status, error
        FROM sync_queue
        WHERE status IN ('PENDING', 'ERROR')
        ORDER BY id ASC
        LIMIT ?
        `,
        [limit]
        );

        const items = (rows ?? []).map(r => ({
        ...r,
        payload: safeJsonParse(r.payload)
        }));

        return { status: 'success', items };
    } catch (error) {
        console.error('Error al obtener pendientes de sync_queue:', error);
        return { status: 'error', message: error?.message ?? String(error), items: [] };
    }
};

export const sqlite_QueueMarkSent = async (id) => {
    try {
        const dbInstance = await getDb();

        await dbInstance.runAsync(
        `
        UPDATE sync_queue
        SET status = 'SENT', error = NULL
        WHERE id = ?
        `,
        [id]
        );

        return { status: 'success' };
    } catch (error) {
        console.error('Error al marcar como enviado en sync_queue:', error);
        return { status: 'error', message: error?.message ?? String(error) };
    }
};

export const sqlite_QueueMarkError = async (id, errorMgs) => {
    try{
        const dbInstance =  await getDb();

        await dbInstance.runAsync(
            `
                UPDATE sync_queue
                SET status = 'ERROR', error = ?
                WHERE id = ?
            `,
            [String(errorMgs ?? 'Unknown error'), id]
        );

        return {status: 'success'};
    }catch(error){
        console.error('Error al marcar como error en sync_queue:', error);
        return {status: 'error', message: error?.message ?? String(error)};
    }
}

export const runSyncQueue = async ({ token, userInfo }) => {
    // 1) leer pendientes
    const pending = await sqlite_QueueGetPending(50);
    if (pending.status !== 'success') return pending;

    for (const item of pending.items) {
        try {
        const { entity, action, payload } = item;

        console.log('Processing sync queue item:', item);
        console.log('payload', payload);

        throw new Error(`Unhandled sync item: ${entity}/${action}`);
        } catch (err) {
        await sqlite_QueueMarkError(item.id, err?.message ?? String(err));
        }
  }

  await sqlite_SetSyncsState('last_sync_queue_run', new Date().toISOString());
  return { status: 'success' };
};

function safeJsonParse(str) {
    try{ return JSON.parse(str); } catch{ return null; }
}