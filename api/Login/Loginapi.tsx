import * as constant from '../../constants/Constants';
import { DecryptObject, EncryptText } from '../../helpers/Encryption';

export default async function Loginapi(params, ptoken) {

    let jsVar = {
      "option": parseInt(params.option),
      "idPersonnal": parseInt(params.idPersonnal ? params.idPersonnal : 0),
      "noEmployee": EncryptText(params.noemployee, constant.ENCRYPT_KEY_FUSION),
      "idLocation": parseInt(params.idLocation),
      "idCenter": parseInt(params.idCenter),
      "password": EncryptText(params.password, constant.ENCRYPT_KEY_FUSION),//params.password
    }

    //console.log('jsVar: ', jsVar);
    
    let url =  constant.path_url + 'Personnal/SelectPersonnal';
    
    let axiosResult = '';

    let token = ptoken ? ptoken : '';//await constant.getDataToken();; 

    //console.log('token: ', token);

    await constant.authAxios(token).post(url,jsVar).then(response => {
      //console.log(' response.data: ', response);
      if(response.data && response.data.payload){
        axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
      }else{
        axiosResult = response.data;
      }
    }
   ).catch(async (error) => {
    //console.log('error: ', error);

    let jsErr = {

      "jsonsend": constant.validationField(JSON.stringify(jsVar)),
      "resultstatus": constant.validationField(error.toString()),
      "followapifunction":constant.validationField(url)
      
    }

    let tmptoken = ptoken ? ptoken : '';
    await constant.exp_Insert_ErrorControl(jsErr,tmptoken);


  } );

   return axiosResult;

}


export async function GetTokenApi(params) {

  let jsVar = {
    "option": parseInt(params.option),
    "idPersonnal": parseInt(params.idPersonnal),
    "noEmployee": params.noemployee,
    "idLocation": parseInt(params.idLocation),
    "idCenter": parseInt(params.idCenter),
    "password": params.password
  }
      
  let url =  constant.path_url + 'Login/GetToken';
  let axiosResult = '';

  await  constant.NAuthAxios().post(url,jsVar).then(response => {
      if(response.data && response.data.payload){
        axiosResult = DecryptObject(response.data.payload,constant.ENCRYPT_KEY_FUSION);
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


