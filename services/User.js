import Loginapi from '../api/Login/Loginapi';
import { getDb } from '../database/index';

export const sqlite_LoginValidation = async (userInfo) => {
  try 
  {
      const dbInstance = await getDb();
      const userExists = await dbInstance.getFirstAsync(
          'SELECT * FROM users WHERE noEmployee = ?',
          [userInfo.noemployee]
      );

      if (!userExists) {
          return { status: 'not_found', message: 'El empleado no está registrado' };
      }

      if (userExists.password.toLowerCase() !== userInfo.password.toLowerCase()) {
          return { status: 'wrong_password', message: 'La contraseña es incorrecta' };
      }

      return { status: 'success', user: userExists };
  } catch (e) {
      console.error('Error al seleccionar usuarios:', e);
      return { status: 'error', message: 'Error en la base de datos' };
  }
};

export const sqlite_InsertUser = async (userInfo) => {
  try {
      const dbInstance = await getDb();
      const existing = await dbInstance.getFirstAsync(
          'SELECT id FROM users WHERE noEmployee = ?',
          [userInfo.noEmployee]
      );

      if (existing) return 0;

      const result = await dbInstance.runAsync(
          'INSERT INTO users (noEmployee, password, completeName, idPersonnal, idCenter, center) VALUES (?, ?, ?, ?, ?, ?)',
          [userInfo.noEmployee, userInfo.password, userInfo.completeName, userInfo.idPersonnal, userInfo.idCenter, userInfo.center]
      );

      return result.lastInsertRowId;
  } catch (error) {
      console.error("Error general en sqlite_InsertUser:", error);
  }
};

export const sqlite_SyncUsers = async (ptoken) => {
    try{
        const params = {
            "option": 8,
            "idPersonnal": 0,
            "noemployee": '',
            "idLocation": 0,
            "idCenter": 0,
            "password": ''
        }

        const users = await Loginapi(params, ptoken);
        //console.log('users', users)

        if(!Array.isArray(users)){
            return {status: 'error', message: "Respuesta Invalida (users)"}
        }

        const clr = await sqlite_ClearUsers();
        if(clr.status !== 'success') return clr;
        console.log('eliminacion de usuarios anteriores succesfully')

        const up =  await sqlite_UpsertUsers(users);
        if(up.status !== 'success') return up;

        return { status: 'success', message: 'Usuarios sincronizados', count: up.count, lastSync: now };
    } catch (e) {
        return { status: 'error', message: e?.message ?? String(e) };
    }
}

export const sqlite_UpsertUsers = async (users) => {
    let db;
    try{
        if(!Array.isArray(users)){
            return {status: "error", message: 'Usuarios Invalidos'};
        }

        db = await getDb();
        await db.execAsync('BEGIN TRANSACTION;');

        for(const usr of users){
            await db.runAsync(
                `
                INSERT INTO users 
                (noEmployee, password, completeName, idPersonnal, idCenter, 
                center) 
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                 [
                    usr.noEmployee, 
                    usr.password, 
                    usr.completeName, 
                    usr.idPersonnal, 
                    usr.idCenter, 
                    usr.center
                ]
            );
        }
        await db.execAsync('COMMIT;');
        return{status: 'success', count: users.length};
    }catch(e){
        try{if(db) await db.execAsync('ROLLBACK;'); } catch {}
        return {status: 'error', message: e?.message ?? String(e)};
    }
}

export async function sqlite_ClearUsers() {
    try{
        const dbInstance = await getDb();

        await dbInstance.execAsync(`DELETE FROM users`)
        return{status: 'success'}
    }catch(e){
        return{status: 'error', message: e?.message ?? String(e)}
    }
}

async function DropTables(){
    try {
        const dbInstance = await getDBInstance();

        await dbInstance.execAsync(`DROP TABLE IF EXISTS users;`);

        console.log(`Tabla 'users' eliminada (si existía).`);
    } catch (error) {
        console.error("Error al eliminar la tabla:", error);
    }
}