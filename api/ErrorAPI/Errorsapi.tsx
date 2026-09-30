import * as constant from '../../constants/Constants';

export default async function Insert_ErrorControl(params, ptoken) {

    let jsVar = {
    
      "JSONSend": constant.validationField(params.jsonsend),
      "ResultStatus": constant.validationField(params.resultstatus),
      "FollowAPIFunction":constant.validationField(params.followapifunction),
      "IdPersonnalInsert": parseInt(params.idpersonnalinsert)
  
    }
  
    //console.log(jsVar);

    let url = constant.path_url + 'Error/Insert_ErrorControl';
    
    let axiosResult = '';

    //let token = ptoken ? ptoken : await constant.getDataToken();; 
  
    await constant.authAxios(ptoken).post(url, jsVar, { headers: { 'Content-Type': 'application/json' }}).then(response => {
      axiosResult = response.data;
    })
    .catch((error) => console.log( error.response) );
  
    return axiosResult;
  }

