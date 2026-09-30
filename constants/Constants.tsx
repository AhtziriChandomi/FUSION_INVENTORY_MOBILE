import axios from 'axios';
import moment from "moment";
import Insert_ErrorControl from '../api/ErrorAPI/Errorsapi';
import { DecryptObject } from '../helpers/Encryption';

export const IDENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT;
export const path_url = process.env.EXPO_PUBLIC_PATH_URL;
export const path_GoCCSI = process.env.EXPO_PUBLIC_GOCCSI;

export const APP_VERSION = process.env.EXPO_PUBLIC_VERSION;
export const ENCRYPT_KEY_GOCCSI = process.env.EXPO_PUBLIC_ENCRYPT_KEY_GOCCSI;
export const ENCRYPT_KEY_FUSION = process.env.EXPO_PUBLIC_ENCRYPT_KEY_FUSION;

export const ID_CATINV_LOCATIONS_CATALOG = (IDENVIRONMENT == 3) ? 176 : (IDENVIRONMENT == 2 ? 75 : 30)

const headers = {
    Authorization: ''
};

export const authAxios = (token) => {

    // if(reactLocalStorage.get(TOKEN))
    //     {headers.Authorization = `Bearer ${reactLocalStorage.get(TOKEN)}`; }

    if(token)
        {headers.Authorization = `Bearer ${token}`; }


        const authAxios = axios.create({
                            baseURL: path_url,
                            //headers: {
                                //Authorization: `Bearer ${reactLocalStorage.get(TOKEN)}`
                                //Authorization: `Bearer ${getTokenNOExpiration}`
                            headers,
                            //}
                        }); 
                
        authAxios.interceptors.response.use(
            (response) =>
                new Promise((resolve, reject) => {
                resolve(response);
                }),
            (error) => {
                if (!error.response) {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
                }
            }
            );


            return authAxios;

}

export const NAuthAxios = () => {

const authAxios = axios.create({
                    baseURL: path_url,
                    //headers: {
                        //Authorization: `Bearer ${reactLocalStorage.get(TOKEN)}`
                        //Authorization: `Bearer ${getTokenNOExpiration}`
                    headers,
                    //}
                }); 
        
authAxios.interceptors.response.use(
    (response) =>
        new Promise((resolve, reject) => {
        resolve(response);
        }),
    (error) => {
        if (!error.response) {
        return new Promise((resolve, reject) => {
            reject(error);
        });
        }
    }
    );


    return authAxios;

}

export const validationField = (fieldString) => 
{
    // Si fieldString es null, undefined o no es una cadena, devolvemos un string vacío
    if (!fieldString || typeof fieldString !== 'string') {
        return ''; 
    }

    return fieldString.replace('\'','').replace('"','');

}

export async function exp_Insert_ErrorControl(params, ptoken)
{

    //let userInfo =JSON.parse(GetUserInfoNAsync());

    //userInfo ? (params.idpersonnalinsert = userInfo.idPersonnal) :(params.idpersonnalinsert = 0)

    //await Insert_ErrorControl(params,'');

    // window.localStorage.clear();
    // window.location = '/';

    let jsVar = {
    
        "JSONSend": validationField(params.jsonsend),
        "ResultStatus": validationField(params.resultstatus),
        "FollowAPIFunction":validationField(params.followapifunction),
        "IdPersonnalInsert": parseInt(params.idpersonnalinsert)
    
      }
    
      //console.log(jsVar);
  
      let url = path_url + 'Error/Insert_ErrorControl';
      
      let axiosResult = '';
  
      let token = ptoken ? ptoken : ''; //await constant.getDataToken();; 
    
      await authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
        axiosResult = response.data;
      })
      .catch((error) => console.log( error.response) );
    
      return axiosResult;
  

}

//////////SQLLite ////////////////
export const nameSQLiteDB = 'foodccsi.db'

export const datesFormat = "MM/dd/yyyy";

export function formatDate(datetime) {
    return moment(datetime).format('DD/MM/YYYY');
}

export function saveDateTime(datetime) {
    return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
}

export function saveDate(datetime) {
    return moment(datetime).format('YYYY-MM-DD');
} 

export function formatDateTime(datetime) {
    return moment(datetime).format('DD/MM/YYYY HH:mm');
}

export function formatTime(datetime) {
    return moment(datetime).format('HH:mm');
}

export const onlyNumbers = (text) => text.replace(/[^0-9]/g, '');

export const onlyDecimal = (text) => {
  if (!text) return '';

  // Permitir coma o punto → normalizar a punto
  let value = text.replace(',', '.');

  // Eliminar todo excepto números y punto
  value = value.replace(/[^0-9.]/g, '');

  // Evitar más de un punto
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limitar a 2 decimales
  if (parts[1]?.length > 2) {
    value = parts[0] + '.' + parts[1].slice(0, 2);
  }

  return value;
};


export async function URLTOBase64(url, mimeType){
    try {
        const base64 = await urlToBase64Remote(url);

        return mimeType + "," + base64;
    } catch (error) {
        console.error("❌ ERROR en URLTOBase64:", error);
        throw error;
    }
}


//Alerts Catalog
export const ALR_NEW = 4348;
export const ALR_READ = 4349;
export const ALR_DELETED = 4350;
export const ALR_IMPORTANT = 4351;
export const ALR_CORRECTED = 4352;
export const ALT_OKCAFETERIA = (parseInt(IDENVIRONMENT) === parseInt(3)) ? 4960 : (parseInt(IDENVIRONMENT) === parseInt(2) ? 4960 : 5586)

export function getFileName(index, extension) {

    let type = '';

    if(extension.toLowerCase().includes('jpeg') === true  || extension.toLowerCase().includes('png') === true)
        type = 'image';
    else
        type = 'file';

    return type + '_' + index.toString() + moment(new Date()).format('YYYYMMDDHHmmss.SSS') + '.' + extension;  
}

export function getCommaSeparatedIDs(array) {

    let ids = '';

    if (array.length > 0) {

        let arrayIds = [];

        array.map(item => {
            arrayIds.push(item.value);
        })

        ids = arrayIds.join(', ');
    }

    return ids;
}

export async function apiRequest({ url, data, token }) {
    try {
        const authToken = token || '';

        const response = await authAxios(authToken).post(url, data, {
            headers: { 'Content-Type': 'application/json' }
        });

        let result = response.data;   
        
        if (response.data && response.data.payload) {
            result = DecryptObject(response.data.payload, ENCRYPT_KEY_FUSION);
        }        

        // Si es un array, lo pasamos. Si no, devolvemos un array vacío por seguridad.
        return Array.isArray(result) ? result : (result || []);

    } catch (error) {
        const jsErr = {
            jsonsend: validationField(JSON.stringify(data)),
            resultstatus: validationField(error.message),
            followapifunction: validationField(url)
        };

        await Insert_ErrorControl(jsErr);
        
        return []; 
    }
}

