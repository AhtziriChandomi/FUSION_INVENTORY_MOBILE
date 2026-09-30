import * as constant from '../../constants/Constants';
import { DecryptObject } from '../../helpers/Encryption';

export async function Select_CatInv_Catalogs(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idSearch": parseInt(params.idSearch),
  }

  let url = constant.path_url + 'Catalog/Select_CatInv_Catalogs';

  let axiosResult = '';

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

export async function Select_ReferralsCenters(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idCenterToWork": parseInt(params.idCenterToWork),
    "isHistoric": params.isHistoric
  }

  let url = constant.path_url + 'Catalog/Select_ReferralsCenters';

  let axiosResult = [];

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

export async function Select_Notifications_Catalogs(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idSearch": parseInt(params.idSearch),
  }

  let url = constant.path_url + 'Catalog/Select_Notifications_Catalogs';

  let axiosResult = '';

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

export async function Select_Catalogs(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idSearch": parseInt(params.idSearch),
    "intParam": parseInt(params.intParam),
  }

  let url = constant.path_url + 'Catalog/Select_Catalogs';

  let axiosResult = '';

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