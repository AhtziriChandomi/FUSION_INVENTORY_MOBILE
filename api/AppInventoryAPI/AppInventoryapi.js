import * as constant from '../../constants/Constants';
import { DecryptObject } from '../../helpers/Encryption';

/**
 * Sincroniza un bloque de cambios de activos.
 * 0 en cualquier id = sin cambio (el SP conserva el valor actual).
 *
 * Respuesta esperada: un renglón por cada idPending
 *   [{ idPending: 1, result: 1, message: '' }, ...]
 *   result 1 = actualizado, 2 = no existe, 3 = error, 4 = otro
 *
 * Si falla la conexión regresa '' (igual que tus otras APIs); la
 * sincronización lo detecta y NO borra los pendientes.
 */
export async function app_Sync_Asset_Updates(params, ptoken, folio) {

  let jsVar = {
    "option": 0,
    "folio": parseInt(folio) || 0, 
    "assets": params.map(item => ({
      "idPending": parseInt(item.idPending) || 0,
      "assetNumber": item.assetNumber,
      "idOrganization": parseInt(item.idOrganization) || 0,
      "idCenter": parseInt(item.idCenter) || 0,
      "idLocation": parseInt(item.idLocation) || 0,
      "idStatus": parseInt(item.idStatus) || 0,
      "idPersonnal": parseInt(item.idPersonnal) || 0,
    }))
  }

  let url = constant.path_url + 'AppInventory/app_Sync_Asset_Updates';

  let axiosResult = '';

    console.log('---------params', params);
    console.log('---------jsvar', jsVar);

  let token = ptoken ? ptoken : await constant.getDataToken();

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' } }).then(response => {
    if (response.data && response.data.payload) {
      axiosResult = DecryptObject(response.data.payload, constant.ENCRYPT_KEY_FUSION);
    } else {
      axiosResult = response.data;
    }
  }
  ).catch(async (error) => {

    let jsErr = {

      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction": constant.validationField(url)

    }

    await constant.exp_Insert_ErrorControl(jsErr);


  });

  return axiosResult;

}