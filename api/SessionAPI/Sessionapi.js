import * as constant from '../../constants/Constants';
import { DecryptObject } from '../../helpers/Encryption';

export async function Insert_Session(params, ptoken) {
  let jsVar = {    
    "Token": params.Token,
    "idRelation": parseInt(params.idRelation),    
  }

  let url = constant.path_url + 'Sessions/Insert_Session';
  
  let axiosResult = [];

  await constant.authAxios(ptoken).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload, constant.ENCRYPT_KEY_FUSION);  
    }else{
      axiosResult = response.data;
    }
  }).catch(async (error) => {
    let jsErr = {
      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)      
    }

    await constant.exp_Insert_ErrorControl(jsErr);
  });
  return axiosResult;
}

export async function Select_Sessions(params, ptoken) {


  
  const state = store.getState();
  const sToken = state.session.token;

  const arrToken = [];
  arrToken.push({ token: sToken});

  return arrToken;

  /*let jsVar = {
    "Option": parseInt(params.Option),
    "idRelation": parseInt(params.idRelation),
    "idSession": parseInt(params.idSession)
  }

  let url = constant.path_url + 'Sessions/Select_Sessions';
  
  let axiosResult = [];

  await constant.authAxios(ptoken).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    axiosResult = response.data;
  }).catch(async (error) => {

    let jsErr = {
      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)      
    }
    await constant.exp_Insert_ErrorControl(jsErr);
  });
  return axiosResult;*/
}

export async function Update_Session(params, ptoken) {

  let jsVar = {  
    "Option": parseInt(params.Option),
    "idSession": parseInt(params.idSession),
    "idRelation": parseInt(params.idRelation),
    "isActive" : params.isActive 
  }

  let url = constant.path_url + 'Sessions/Update_Session';
  
  let axiosResult = [];

  await constant.authAxios(ptoken).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload, constant.ENCRYPT_ENCRYPT_KEY_FUSIONKEY);
    }else{
      axiosResult = response.data;
    }
  }).catch(async (error) => {

    let jsErr = {
      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)      
    }

    await constant.exp_Insert_ErrorControl(jsErr);
  });
  return axiosResult;
}
