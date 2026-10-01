import { getDb } from '../database/index';
import { runDbWrite } from './dbQueue';

/* ============================================================================
   Catálogos guardados en SQLite para usarlos en modo offline.
   La tabla CatalogOptions se crea en database/schema.js (CreateStructureBD).
   Las locations se guardan con parentId = idCenter.
   ============================================================================ */

export const CATALOG_TYPE = {
  ORGANIZATION: 'organization',
  CENTER: 'center',
  STATUS: 'status',
  LOCATION: 'location',
} as const;

export type CatalogOption = { value: number; label: string };

/* ================================== INSERT ================================== */

/**
 * Reemplaza el catálogo completo (borra el anterior y guarda el nuevo).
 * Si la lista viene vacía no se toca lo guardado, para no perder el catálogo
 * cuando la API falla y regresa ''.
 */
export const sqlite_SaveCatalog = async (catalogType: string, options: CatalogOption[], parentId = 0) => {
  if (!options || options.length === 0) return 0;

  try {
    // En fila: varias descargas de locations pueden terminar al mismo tiempo
    await runDbWrite(async () => {
      const dbInstance = await getDb();

      await dbInstance.withTransactionAsync(async () => {
        await dbInstance.runAsync(
          'DELETE FROM CatalogOptions WHERE catalogType = ? AND parentId = ?',
          [catalogType, parentId]
        );

        let order = 0;
        for (const opt of options) {
          await dbInstance.runAsync(
            'INSERT OR REPLACE INTO CatalogOptions (catalogType, parentId, value, label, sortOrder) VALUES (?, ?, ?, ?, ?)',
            [catalogType, parentId, Number(opt.value) || 0, opt.label ?? '', order++]
          );
        }
      });
    });

    return options.length;
  } catch (error) {
    console.error(`Error al guardar catálogo ${catalogType}:`, error);
    return 0;
  }
};

/* ================================== SELECT ================================== */

export const sqlite_SelectCatalog = async (catalogType: string, parentId = 0): Promise<CatalogOption[]> => {
  try {
    const dbInstance = await getDb();
    const rows = await dbInstance.getAllAsync(
      'SELECT value, label FROM CatalogOptions WHERE catalogType = ? AND parentId = ? ORDER BY sortOrder ASC',
      [catalogType, parentId]
    );
    return (rows ?? []).map((r: any) => ({ value: Number(r.value), label: String(r.label) }));
  } catch (error) {
    console.error(`Error al consultar catálogo ${catalogType}:`, error);
    return [];
  }
};

// Fecha de la última descarga de catálogos (para mostrarla en pantalla si se requiere)
export const sqlite_SelectCatalogsLastUpdate = async (): Promise<string | null> => {
  try {
    const dbInstance = await getDb();
    const row = await dbInstance.getFirstAsync('SELECT MAX(updateDate) AS lastUpdate FROM CatalogOptions');
    return row?.lastUpdate ?? null;
  } catch (error) {
    console.error('Error al consultar fecha de catálogos:', error);
    return null;
  }
};