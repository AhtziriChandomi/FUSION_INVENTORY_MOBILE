import * as constant from '../../constants/Constants';
import { DecryptObject } from '../../helpers/Encryption';

export async function Select_Static_Catalogs_Options(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idCatalog": parseInt(params.idCatalog),
    "searchValue": params.searchValue,
    "idType": parseInt(params.idType),
  }

  let url = constant.path_url + 'StaticCatalog/Select_Static_Catalogs_Options';

  let axiosResult = [];

  let token = ptoken ? ptoken : await constant.getDataToken();

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' } }).then(response => {
    // console.log("Select_Static_Catalogs_Options", response.data);
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