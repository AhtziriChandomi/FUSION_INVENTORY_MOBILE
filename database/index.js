import * as SQLite from 'expo-sqlite';
import * as constant from '../constants/Constants';

let db = null;

export const getDb = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync(constant.nameSQLiteDB);
  }
  return db;
};
