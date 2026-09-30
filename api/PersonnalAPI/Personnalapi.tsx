import * as constant from '../../constants/Constants';
import { DecryptObject, EncryptText } from '../../helpers/Encryption';

//SELECT PERSONNAL FROM TRESS GOCCSI HAS CONNECTION DIRECTLY IN BACK WITH GOCCSI
export async function Select_Personnal(params,ptoken) {
   
    let jsVar = {
        "option": parseInt(params.option),
        "idPersonnal": parseInt(params.idPersonnal),
        "noEmployee": EncryptText(params.noEmployee, constant.ENCRYPT_KEY_FUSION),//params.noEmployee,
        "idLocation": parseInt(params.idLocation),
        "idCenter": parseInt(params.idCenter),
        "password": EncryptText(params.password, constant.ENCRYPT_KEY_FUSION),//params.password
    }

    let url = constant.path_url + 'Personnal/SelectPersonnal';
  
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

//SELECT PERMISSIONS FROM OWN TABLE IN DB
export async function Select_RolesByIdPersonnal(params,ptoken) {
   
    let jsVar = {
      "option": parseInt(params.option),
      "idPersonnal": parseInt(params.idPersonnal)
    }
  
    let url = constant.path_url + 'Role/Select_RolesByIdPersonnal';
  
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
      
  
    });
  
    return axiosResult;
  
}

export async function Select_PermissionsByIdPersonnal(params,ptoken) {
   
    let jsVar = {
      "option": parseInt(params.option),
      "idPersonnal": parseInt(params.idPersonnal)
    }
  
    let url = constant.path_url  + 'Permission/Select_PermissionsByIdPersonnal';
  
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

//HAS CONNECTION DIRECTLY IN BACK WITH GOCCSI
export async function SelectCatalogOptions(params,ptoken) {
   
  let jsVar = {
    "option": parseInt(params.option),
    "idCatalog": parseInt(params.idCatalog),
    "idCatalogOptions": parseInt(params.idCatalogOptions)
  }

  let url = constant.path_url  + 'Personnal/SelectCatalogOptions';

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

export async function Select_PersonnalByRole(params,ptoken) {
   
  let jsVar = {
    
    "idPersonnal": parseInt(params.idPersonnal),
    "idRole": parseInt(params.idRole)
    
  }

  let url = constant.path_url  + 'Personnal/Select_PersonnalByRole';

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

export async function Select_PhotosPersonnalByCriteria(params,ptoken) {
  let jsVar = {
      
      "option": parseInt(params.option),
      "idPersonnal": parseInt(params.idpersonnal),
      "Criteria" : params.criteria
      
  }
  
  let url = constant.path_GoCCSI + 'Personnal/Select_PhotosPersonnalByCriteria';
  let axiosResult = '';

  let token = ptoken ? ptoken : '';

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
      if(response.data && response.data.payload){
        axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_GOCCSI);
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


    });
  return axiosResult;
}

//SELECT PERSONNAL FROM TRESS GOCCSI SP IS IN LIVE DB
export async function Select_PersonnalByFilters(params,ptoken) {
   
  let jsVar = {
      "option": parseInt(params.option),
      "idPersonnal": parseInt(params.idPersonnal),
      "noEmployee": params.noEmployee,
      "idPersonnalBoss": parseInt(params.idPersonnalBoss),
      "name" : params.name,
      "idCenter" : parseInt(params.idCenter),
      "idDepartment" : parseInt(params.idDepartment),
      "idPersonnalType" : parseInt(params.idPersonnalType)
  }

  let url = constant.path_url + 'Personnal/Select_PersonnalByFilters';

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

export async function Select_PersonnalToken(params,ptoken) {
   
  let jsVar = {
      "Option": parseInt(params.Option),
      "idPersonnal": parseInt(params.idPersonnal),
      "Token": params.Token
     
  }

  //console.log(jsVar);

  let url = constant.path_url + 'Personnal/Select_PersonnalToken';

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

export async function Insert_PersonnalToken(params,ptoken) {
   
  let jsVar = {
      "idPersonnal": parseInt(params.idPersonnal),
     
  }

  let url = constant.path_url + 'Personnal/Insert_PersonnalToken';

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

export async function InsertUpdate_PersonnalExtraInfo(params,ptoken) {

  let jsVar = {
      "idPersonnal": parseInt(params.idPersonnal),
      "idPersonnalExtraInfo": parseInt(params.idPersonnalExtraInfo),
      "idPersonnalInsert": parseInt(params.idPersonnalInsert),
      "autenticationPin": params.autenticationPin
    }

  let url = constant.path_GoCCSI + 'Personnal/InsertUpdate_PersonnalExtraInfo';

  let axiosResult = '';

  let token = ptoken ? ptoken : '';; 

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_GOCCSI);
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

export async function Select_PersonnalExtraInfo(params,ptoken) {

  let jsVar = {
      "idPersonnal": parseInt(params.idPersonnal)
    }

  let url = constant.path_GoCCSI + 'Personnal/Select_PersonnalExtraInfo';

  let axiosResult = '';

  let token = ptoken ? ptoken : '';; 

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_GOCCSI);
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

export async function Get_Personnal_ByNoEmployee(params, ptoken) {
  let jsVar = {
    "noEmployees": params.noEmployees  
  }
  
  let url = constant.path_url + 'Personnal/Get_Personnal_ByNoEmployee';

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


    });
  return axiosResult;
}

export async function SelectCurrentDateTime(params, ptoken) {
   
  let jsVar = {

    "idCenter": parseInt(params.idCenter)
  }

  let url = constant.path_GoCCSI + 'Clock/SelectCurrentDateTime';

  let axiosResult = '';

  let token = ptoken ? ptoken : '';

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
    if(response.data && response.data.payload){
      axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_GOCCSI);
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
