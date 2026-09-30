import { getDb } from './index';

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

    }catch(error){
        console.log('Error al crear la tabla: ', error);
    }
}
