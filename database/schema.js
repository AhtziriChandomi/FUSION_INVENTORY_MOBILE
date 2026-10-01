import { getDb } from './index';

// Agrega una columna solo si no existe (para bases que ya estaban instaladas)
async function addColumnIfMissing(dbInstance, table, column, definition) {
    const cols = await dbInstance.getAllAsync(`PRAGMA table_info(${table})`);
    if (!cols.some(c => c.name === column)) {
        await dbInstance.execAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
        console.log(`Columna '${column}' agregada a '${table}'`);
    }
}

export async function CreateStructureBD() {   
    try{
        //await DropTables()
        const dbInstance = await getDb();

        await dbInstance.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLe IF NOT EXISTS sync_state(
                key TEXT PRIMARY KEY NOT NULL,
                value TEXT NOT NULL
            );
        `);
        console.log("Tabla 'sync_state' creada o ya existe")

        await dbInstance.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY NOT NULL, 
                noEmployee TEXT NOT NULL,
                password TEXT NOT NULL,
                completeName TEXT NOT NULL, 
                idPersonnal INTEGER NOT NULL,
                idCenter INTEGER NOT NULL,
                center TEXT NOT NULL
            );
        `);
        console.log("Tabla 'users' creada o ya existe")

        await dbInstance.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS token (
                id INTEGER PRIMARY KEY NOT NULL, 
                token TEXT NOT NULL,
                idPersonnal INTEGER NOT NULL
            );
        `)
        console.log("Tabla 'token' creada o ya existe")

        // Cola genérica que usa tu syncQueueService (sqlite_QueueAdd, runSyncQueue...)
        await dbInstance.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS sync_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                entity TEXT NOT NULL,
                action TEXT NOT NULL,
                payload TEXT NOT NULL DEFAULT '{}',
                status TEXT NOT NULL DEFAULT 'PENDING',
                error TEXT,
                createdAt TEXT NOT NULL DEFAULT (datetime('now'))
            );
        `)
        console.log("Tabla 'sync_queue' creada o ya existe")

        // Catálogos para modo offline: organization, center, status y location
        // (las locations se guardan con parentId = idCenter)
        await dbInstance.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS CatalogOptions (
                catalogType TEXT    NOT NULL,
                parentId    INTEGER NOT NULL DEFAULT 0,
                value       INTEGER NOT NULL,
                label       TEXT    NOT NULL DEFAULT '',
                sortOrder   INTEGER NOT NULL DEFAULT 0,
                updateDate  TEXT    NOT NULL DEFAULT (datetime('now','localtime')),
                PRIMARY KEY (catalogType, parentId, value)
            );
        `)
        console.log("Tabla 'CatalogOptions' creada o ya existe")

        // Cambios de inventario pendientes de sincronizar
        await dbInstance.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS PendingAssetUpdates (
                idPending      INTEGER PRIMARY KEY AUTOINCREMENT,
                idBatch        TEXT    NOT NULL,
                assetNumber    TEXT    NOT NULL,
                idOrganization INTEGER NOT NULL DEFAULT 0,
                idCenter       INTEGER NOT NULL DEFAULT 0,
                idLocation     INTEGER NOT NULL DEFAULT 0,
                idStatus       INTEGER NOT NULL DEFAULT 0,
                summary        TEXT    NOT NULL DEFAULT '',
                idPersonnal    INTEGER NOT NULL DEFAULT 0,
                syncStatus     INTEGER NOT NULL DEFAULT 0,
                syncResult     TEXT    NOT NULL DEFAULT '',
                errorMessage   TEXT    NOT NULL DEFAULT '',
                insertDate     TEXT    NOT NULL DEFAULT (datetime('now','localtime'))
            );
            CREATE INDEX IF NOT EXISTS IX_PendingAssetUpdates_Status ON PendingAssetUpdates(syncStatus);
        `)
        // Si la tabla ya existía de una versión anterior sin esta columna
        await addColumnIfMissing(dbInstance, 'PendingAssetUpdates', 'syncResult', "TEXT NOT NULL DEFAULT ''");
        console.log("Tabla 'PendingAssetUpdates' creada o ya existe")

    }catch(error){
        console.log('Error al crear la tabla: ', error);
    }
}