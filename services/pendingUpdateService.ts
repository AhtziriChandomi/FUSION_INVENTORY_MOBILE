import { getDb } from '../database/index';
import { runDbWrite } from './dbQueue';

// 0 = pendiente, 2 = falló al sincronizar (se reintenta en la siguiente sincronización)
export const SYNC_STATUS = { PENDING: 0, ERROR: 2 } as const;

export type PendingRow = {
  idPending: number;
  idBatch: string;
  assetNumber: string;
  idOrganization: number;
  idCenter: number;
  idLocation: number;
  idStatus: number;
  summary: string;
  idPersonnal: number;
  syncStatus: number;
  errorMessage: string;
  syncResult: string; // '' | 'notfound' | 'error' | 'other' (resultado del último intento)
  insertDate: string;
};

export type NewPendingRow = Pick<
  PendingRow,
  'assetNumber' | 'idOrganization' | 'idCenter' | 'idLocation' | 'idStatus' | 'summary' | 'idPersonnal'
>;

// La tabla PendingAssetUpdates se crea en database/schema.js (CreateStructureBD)

/* ================================== INSERT ================================== */

export const sqlite_InsertPendingUpdates = async (rows: NewPendingRow[], idBatch: string) => {
  try {
    // En fila: no debe cruzarse con el guardado de catálogos u otras escrituras
    await runDbWrite(async () => {
      const dbInstance = await getDb();

      await dbInstance.withTransactionAsync(async () => {
        for (const r of rows) {
          await dbInstance.runAsync(
            `INSERT INTO PendingAssetUpdates
               (idBatch, assetNumber, idOrganization, idCenter, idLocation, idStatus, summary, idPersonnal)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              idBatch,
              r.assetNumber,
              // undefined/null se envía como NULL y rompe el NOT NULL: siempre mandamos un valor
              Number(r.idOrganization) || 0,
              Number(r.idCenter) || 0,
              Number(r.idLocation) || 0,
              Number(r.idStatus) || 0,
              r.summary ?? '',
              Number(r.idPersonnal) || 0,
            ]
          );
        }
      });
    });

    return rows.length;
  } catch (error) {
    console.error('Error al insertar pendientes:', error);
    // Se relanza para que la pantalla muestre el error y el usuario sepa que NO se guardó
    throw error;
  }
};

/* ================================== SELECT ================================== */

// En orden de captura: si un activo tiene 2 cambios, el más reciente se aplica al final
export const sqlite_SelectPendingUpdates = async (): Promise<PendingRow[]> => {
  try {
    const dbInstance = await getDb();
    const result = await dbInstance.getAllAsync(
      'SELECT * FROM PendingAssetUpdates ORDER BY idPending ASC'
    );
    return result ?? [];
  } catch (error) {
    console.error('Error al consultar pendientes:', error);
    return [];
  }
};

export const sqlite_CountPendingUpdates = async (): Promise<{ pending: number; errors: number }> => {
  try {
    const dbInstance = await getDb();
    const row = await dbInstance.getFirstAsync(
      `SELECT
         IFNULL(SUM(CASE WHEN syncStatus = ? THEN 1 ELSE 0 END), 0) AS pending,
         IFNULL(SUM(CASE WHEN syncStatus = ? THEN 1 ELSE 0 END), 0) AS errors
       FROM PendingAssetUpdates`,
      [SYNC_STATUS.PENDING, SYNC_STATUS.ERROR]
    );
    return { pending: row?.pending ?? 0, errors: row?.errors ?? 0 };
  } catch (error) {
    console.error('Error al contar pendientes:', error);
    return { pending: 0, errors: 0 };
  }
};

/* ================================== UPDATE ================================== */

export const sqlite_MarkPendingError = async (idPending: number, syncResult: string, message: string) => {
  try {
    await runDbWrite(async () => {
      const dbInstance = await getDb();
      await dbInstance.runAsync(
        'UPDATE PendingAssetUpdates SET syncStatus = ?, syncResult = ?, errorMessage = ? WHERE idPending = ?',
        [SYNC_STATUS.ERROR, syncResult, message, idPending]
      );
    });
  } catch (error) {
    console.error('Error al marcar pendiente con error:', error);
  }
};

/* ================================== DELETE ================================== */

export const sqlite_DeletePendingUpdates = async (ids: number[]) => {
  if (!ids || ids.length === 0) return;
  try {
    await runDbWrite(async () => {
      const dbInstance = await getDb();
      const placeholders = ids.map(() => '?').join(',');
      await dbInstance.runAsync(
        `DELETE FROM PendingAssetUpdates WHERE idPending IN (${placeholders})`,
        ids
      );
    });
  } catch (error) {
    console.error('Error al borrar pendientes:', error);
  }
};

export const sqlite_DeleteErrorUpdates = async () => {
  try {
    await runDbWrite(async () => {
      const dbInstance = await getDb();
      await dbInstance.runAsync('DELETE FROM PendingAssetUpdates WHERE syncStatus = ?', [SYNC_STATUS.ERROR]);
    });
  } catch (error) {
    console.error('Error al borrar pendientes con error:', error);
  }
};

// Cuántos cambios de un lote siguen en el dispositivo (pendientes o con error)
export const sqlite_CountPendingByBatch = async (idBatch: string): Promise<{ pending: number; errors: number }> => {
  try {
    const dbInstance = await getDb();
    const row = await dbInstance.getFirstAsync(
      `SELECT
         IFNULL(SUM(CASE WHEN syncStatus = ? THEN 1 ELSE 0 END), 0) AS pending,
         IFNULL(SUM(CASE WHEN syncStatus = ? THEN 1 ELSE 0 END), 0) AS errors
       FROM PendingAssetUpdates
       WHERE idBatch = ?`,
      [SYNC_STATUS.PENDING, SYNC_STATUS.ERROR, idBatch]
    );
    return { pending: row?.pending ?? 0, errors: row?.errors ?? 0 };
  } catch (error) {
    console.error('Error al contar pendientes del lote:', error);
    return { pending: 0, errors: 0 };
  }
};