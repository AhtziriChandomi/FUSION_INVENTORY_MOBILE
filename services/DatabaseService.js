import { CreateStructureBD } from "../database/schema";

export const initDatebase = async() => {
    try{
        await CreateStructureBD();
        console.log("Base de datos inicializada correctamente");
    }catch(error){
        console.error("Error al inicializar la base de datos:", error);
    }
}