import * as SQLite from 'expo-sqlite';
import { getDb } from '../database/index';

export const sqlite_GetLastToken = async () => {
    try{
        const dbInstance = await getDb();

        const token = await dbInstance.getFirstAsync(
            `SELECT token FROM token ORDER BY id DESC LIMIT 1`
        );

        console.log("Retrieved token from DB:", token);
        return token ?? null;
    }catch(e){
        console.error('Error al seleccionar el Token: ', e)
        return null;
    }
}

export const sqlite_InsertToken = async (token, idPersonnal) => {
    try{
        const dbInstance = await getDb();
        const existing = await dbInstance.getFirstAsync(
            'SELECT * FROM token WHERE idPersonnal = ?',
            [idPersonnal]
        );

        if(existing){
            await dbInstance.runAsync(
                'DELETE FROM token WHERE idPersonnal = ?',
                [idPersonnal]
            )
        }
       
       const result = await dbInstance.runAsync(
        'INSERT INTO token (token, idPersonnal) VALUES (?, ?)',
        [token, idPersonnal]
       );

       return result.lastInsertRowId;
    } catch(error){
        console.error('Error al insertar token:', error);
    }
}

export const sqlite_GetToken = async (userInfo) => {
    try{
        const dbInstance = await getDb();

        const token = await dbInstance.getFirstAsync(
            'SELECT token FROM token WHERE idPersonnal = ?',
            [userInfo.idPersonnal]
        );

        return token;
    }catch(e){
        console.error('Error al seleccionar el Token: ', e)
        return 0;
    }
}

export async function clearToken() {
    const db = await SQLite.openDatabaseAsync('SQLite_DB');
    await db.runAsync(`DELETE FROM Token`);
}