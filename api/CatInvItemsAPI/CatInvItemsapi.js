import * as constant from '../../constants/Constants';
import { DecryptObject } from '../../helpers/Encryption';

export async function InsertUpdate_CatInv_Items(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idCatInvItem": parseInt(params.idCatInvItem),
    "idCatInv": parseInt(params.idCatInv),
    "alias": constant.removeSpecialCaracters(params.alias),
    "idPersonnal": parseInt(params.idPersonnal),
    "idSource": parseInt(params.idSource),
  }

  let url = constant.path_url + 'CatInvItem/InsertUpdate_CatInv_Items';

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

export async function Select_CatInv_Items(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idCatInvItem": parseInt(params.idCatInvItem),
    "idCatInv": parseInt(params.idCatInv),
    "searchValue": params.searchValue,
  }

  let url = constant.path_url + 'CatInvItem/Select_CatInv_Items';

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

export async function Insert_CatInv_Items_Details(params, ptoken) {

  let jsVar = {
    "optionItem": parseInt(params.optionItem),
    "optionDetail": parseInt(params.optionDetail),
    "idCatInv": parseInt(params.idCatInv),
    "alias": params.alias,
    "idSource": parseInt(params.idSource),
    "details": params.details,
    "idPersonnal": parseInt(params.idPersonnal)
  }

  let url = constant.path_url + 'CatInvItem/Insert_CatInv_Items_Details';

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

export async function Update_Rel_CatInv_Items_By_Field(params, ptoken) {

  let jsVar = {
    "items": params.items,
    "idPersonnal": parseInt(params.idPersonnal)
  }

  let url = constant.path_url + 'CatInvItem/Update_Rel_CatInv_Items_By_Field';

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


export async function Select_CatInv_Items_Fields_By_Filters(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idCatInvItem": parseInt(params.idCatInvItem),
    "labelControl": params.labelControl,
    "propValue": params.propValue,
  }

  let url = constant.path_url + 'CatInvItem/Select_CatInv_Items_Fields_By_Filters';

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

export async function InsertUpdate_CatInv_Items_By_Type(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idCatInvItem": parseInt(params.idCatInvItem),
    "idCatInv": parseInt(params.idCatInv),
    "alias": params.alias,
    "idPersonnal": parseInt(params.idPersonnal),
    "idSource": parseInt(params.idSource),
    "idType": parseInt(params.idType),
  }

  let url = constant.path_url + 'CatInvItem/InsertUpdate_CatInv_Items_By_Type';

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

export async function InsertUpdate_CatInv_Items_ByBulk(params, ptoken) {

  let jsVar = {
    "option": parseInt(params.option),
    "idType": parseInt(params.idType),
    "catInvItemsP": params.catInvItemsP
  }

  let url = constant.path_url + 'CatInvItem/InsertUpdate_CatInv_Items_ByBulk';

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

export async function GetCatInvItemIDs_ByControlName(params, ptoken) {

  let jsVar = {
    "idCatInv": parseInt(params.idCatInv),
    "incomingItems": params.incomingItems
  }

  let url = constant.path_url + 'CatInvItem/GetCatInvItemIDs_ByControlName';

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