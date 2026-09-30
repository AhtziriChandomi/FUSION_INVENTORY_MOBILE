import * as constant from '../../constants/Constants';
import { DecryptObject } from '../../helpers/Encryption';

export async function Select_CI_Management_Personnal_Info(params, ptoken) {
   
    let jsVar = {
      "option": parseInt(params.option),
      "noEmployee": params.noEmployee,
    }
  
    let url = constant.path_url + 'CIManagement/Select_CI_Management_Personnal_Info';
  
    let axiosResult = [];
  
    let token = ptoken ? ptoken : await constant.getDataToken();

    await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
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
            "followapifunction":constant.validationField(url)
        }

        await constant.exp_Insert_ErrorControl(jsErr);
    } );
  
    return axiosResult;
  
}

export async function Select_CI_Types(params, ptoken) {
   
  let jsVar = {
    "option": parseInt(params.option),
  }

  let url = constant.path_url + 'CIManagement/Select_CI_Types';

  let axiosResult = [];

  let token = ptoken ? ptoken : await constant.getDataToken();

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
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
          "followapifunction":constant.validationField(url)
      }

      await constant.exp_Insert_ErrorControl(jsErr);
  } );

  return axiosResult;

}

export async function InsertUpdate_CI_Management(params, ptoken) {
   
  let jsVar = {
    "option": parseInt(params.option),
    "address": params.address,
    "idStatus": parseInt(params.idStatus),
    "idPersonnal": parseInt(params.idPersonnal),
    "idPersonnalInsert": parseInt(params.idPersonnalInsert),
    "insertDate": params.insertDate,
    "idCIManagement": parseInt(params.idCIManagement)
  }

  let url = constant.path_url + 'CIManagement/InsertUpdate_CI_Management';

  let axiosResult = [];

  let token = ptoken ? ptoken : await constant.getDataToken();

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
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
          "followapifunction":constant.validationField(url)
      }

      await constant.exp_Insert_ErrorControl(jsErr);
  } );

  return axiosResult;

}

export async function Select_CI_Management(params, ptoken) {
   
  let jsVar = {
    "option": parseInt(params.option),
    "startDate": params.startDate,
    "endDate": params.endDate,
    "idCIManagement": params.idCIManagement,
    "folio": params.folio,
    "noEmployee": params.noEmployee,
    "idCenter": parseInt(params.idCenter),
    "idDepartament": parseInt(params.idDepartament),
    "createDate": params.createDate,
    "idStatus" : parseInt(params.idStatus),
    "idApproval": parseInt(params.idApproval),
    "asset_number": params.asset_number,
    "serial_number": params.serial_number,
    "idReason": parseInt(params.idReason)
  }

  let url = constant.path_url + 'CIManagement/Select_CI_Management';

  let axiosResult = [];

  let token = ptoken ? ptoken : await constant.getDataToken();

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
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
          "followapifunction":constant.validationField(url)
      }

      await constant.exp_Insert_ErrorControl(jsErr);
  } );

  return axiosResult;

}

export async function Select_CI_Management_Catalogs(params, ptoken) {
   
  let jsVar = {
    "option": parseInt(params.option),
  }

  let url = constant.path_url + 'CIManagement/Select_CI_Management_Catalogs';

  let axiosResult = [];

  let token = ptoken ? ptoken : await constant.getDataToken();

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
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
          "followapifunction":constant.validationField(url)
      }

      await constant.exp_Insert_ErrorControl(jsErr);
  } );

  return axiosResult;

}

export async function Insert_RelCIManagement_Letter(params, ptoken) {
   
  let jsVar = {
    "option": parseInt(params.option),
    "idCIManagement": parseInt(params.idCIManagement),
    "idPersonnal": parseInt(params.idPersonnal)
  }

  let url = constant.path_url + 'CIManagement/Insert_RelCIManagement_Letter';

  let axiosResult = [];

  let token = ptoken ? ptoken : await constant.getDataToken();

  await constant.authAxios(token).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
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
          "followapifunction":constant.validationField(url)
      }

      await constant.exp_Insert_ErrorControl(jsErr);
  } );

  return axiosResult;

}