import * as constant from '../../constants/Constants';
import { DecryptObject } from '../../helpers/Encryption';

export async function InsertUpdate_Roles(params,ptoken) {

  let jsVar = {
      "idRole": parseInt(params.idRole),
      "role": constant.validationField(params.role),
      "idPersonnal": parseInt(params.idPersonnal)
  }

  let url = constant.path_url + 'Role/InsertUpdate_Roles';
  
  let axiosResult = '';

  let token = ptoken ? ptoken : '';

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
    }else{
      axiosResult = response.data;
    }
  }
  ).catch(async (error) => {
   
    let jsErr = {

      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)
      
    }

    await constant.exp_Insert_ErrorControl(jsErr);
   

  } );

  return axiosResult;
}


export async function Select_Roles(params,ptoken) {
   
    let jsVar = {
      "option": parseInt(params.option),
      "idRole": parseInt(params.idRole),
      "role": params.role
      //"idPersonnal": parseInt(params.idPersonnal)
    }
  
    let url = constant.path_url + 'Role/Select_Roles';
  
    let axiosResult = '';
  
    let token = ptoken ? ptoken : '';

    await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
      if(response.data && response.data.payload){
        axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
      }else{
        axiosResult = response.data;
      }
    }
    ).catch(async (error) => {
  
      let jsErr = {

        "jsonsend": constant.validationField(JSON.stringify(jsVar)),
        "resultstatus": constant.validationField(error.toString()),
        "followapifunction":constant.validationField(url)
        
      }

      await constant.exp_Insert_ErrorControl(jsErr);
     

    } );
  
    return axiosResult;
  
}


export async function Delete_Roles(params,ptoken) {
   
  let jsVar = {
   
    "idRole": parseInt(params.idRole),
    "idPersonnalLastModify": parseInt(params.idPersonnalLastModify)
  }

  let url = constant.path_url + 'Role/Delete_Roles';

  let axiosResult = [];

  let token = ptoken ? ptoken : '';

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
    }else{
      axiosResult = response.data;
    }
  }
  ).catch(async (error) => {

    let jsErr = {

      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)
      
    }

    await constant.exp_Insert_ErrorControl(jsErr);

  
  } );

  return axiosResult;

}


export async function Select_Roles_Services(params,ptoken) {
   
  let jsVar = {
   
    "option": parseInt(params.option),
    "idRole": parseInt(params.idRole),
    "idService": parseInt(params.idService)
  }


  let url = constant.path_url + 'Role/Select_Roles_Services';

  let axiosResult = [];

  let token = ptoken ? ptoken : '';

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
    }else{
      axiosResult = response.data;
    }
  }
  ).catch(async (error) => {
    
    let jsErr = {

      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)
      
    }

    await constant.exp_Insert_ErrorControl(jsErr);
   

  } );

  return axiosResult;

}

export async function InsertDelete_Roles_Services(params,ptoken) {
   
  let jsVar = {
    
    "option": parseInt(params.option),
    "idRole": parseInt(params.idRole),
    "idService": parseInt(params.idService)
  }

  let url = constant.path_url + 'Role/InsertDelete_Roles_Services';

  let axiosResult = [];

  let token = ptoken ? ptoken : '';

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
    }else{
      axiosResult = response.data;
    }
  }
  ).catch(async (error) => {
   
    let jsErr = {

      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)
      
    }

    await constant.exp_Insert_ErrorControl(jsErr);
   

  } );

  return axiosResult;
  
}

export async function InsertDelete_Personnal_Roles(params,ptoken) {
  let jsVar = {
   
    "option" : parseInt(params.option),
    "idPersonnal": parseInt(params.idpersonnal),
    "idRole" : parseInt(params.idrole),
    "email": params.email,
    "sipExtension": params.sipExtension,
    "sipPassword": params.sipPassword,
    "idPersonnalInsert": parseInt(params.idPersonnalInsert)
    
  }
  
  let url = constant.path_url + 'Role/InsertDelete_Personnal_Roles';
  let axiosResult = '';

  let token = ptoken ? ptoken : '';

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
    }else{
      axiosResult = response.data;
    }
  }
  ).catch(async (error) => {
    
    let jsErr = {

      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)
      
    }

    await constant.exp_Insert_ErrorControl(jsErr);
   

  } );
  return axiosResult;
}

export async function SelectPersonal_Role_ByStore(params,ptoken) {
  let jsVar = {
    "option": parseInt(params.option),
    "idRole": parseInt(params.idRole),
    "idStore": parseInt(params.idStore)
  };

  let url = constant.path_url + 'Role/SelectPersonal_Role_ByStore';
  let axiosResult = '';

  let token = ptoken ? ptoken : '';

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
    }else{
      axiosResult = response.data;
    }}
  ).catch(async (error) => {
    
    let jsErr = {

      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)
      
    }

    await constant.exp_Insert_ErrorControl(jsErr);
   

  } );
  return axiosResult;
}